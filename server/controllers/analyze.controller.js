const { parseResume } = require("../services/resume.service");
const { extractSkillsAI } = require("../services/aiSkills.service");
const { matchResumeToJD } = require("../services/match.service");
const { generateImprovedResume } = require("../services/improve.service");
const { extractSkills } = require("../utils/skills.util");

const Analysis = require("../models/Analysis");

exports.analyze = async (req, res) => {
  console.log("ANALYZE API HIT");
console.log("FILE:", req.file);
console.log("BODY:", req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jobDesc = req.body.jobDescription;
    if (!jobDesc || jobDesc.trim().length < 15) {
      return res.status(400).json({ error: "Please enter a valid Job Description to analyze." });
    }

    const resumeText = await parseResume(req.file.path);

    let resumeSkills = await extractSkillsAI(resumeText);
    let jobSkills = await extractSkillsAI(jobDesc);
    const stopSkills = [
      "attention to detail",
      "problem-solving",
      "problem solving",
      "wireframes",
      "ui/ux designs",
      "software solutions",
      "issue resolution",
      "backend technologies",
      "front-end development",
      "reusable components",
      "front-end libraries",
      "optimize components",
      "upgrade applications",
      "user authentication",
      "scalable architecture",

      "api integration",
      "debugging",
      "performance optimization",
      "crud operations",
      "responsive design",
      "jwt authentication",
      "rest apis"
    ];

    resumeSkills = resumeSkills.filter(
      skill => !stopSkills.includes(skill.toLowerCase())
    );

    jobSkills = jobSkills.filter(
      skill => !stopSkills.includes(skill.toLowerCase())
    );

    if (resumeSkills.length === 0) {
      resumeSkills = extractSkills(resumeText);
    }

    if (jobSkills.length === 0) {
      jobSkills = extractSkills(jobDesc);
    }

    //  Matching
    const embeddingResult = await matchResumeToJD(resumeText, jobDesc);
    const matchScore = embeddingResult.matchScore;
    const normalizeSkill = (skill) =>
      skill
        .toLowerCase()
        .replace(".js", "")
        .replace("(es6+)", "")
        .replace(/\s+/g, " ")
        .trim();
    const matchedSkills = resumeSkills.filter(skill =>
      jobSkills.some(
        jSkill =>
          normalizeSkill(jSkill) === normalizeSkill(skill)
      )
    );

    const missingSkills = jobSkills.filter(skill =>

      !resumeSkills.some(
        rSkill =>
          normalizeSkill(rSkill) === normalizeSkill(skill)
      )
    );
    resumeSkills = [...new Set(resumeSkills)];
    jobSkills = [...new Set(jobSkills)];
    let suggestions = [];

    if (missingSkills.length > 0) {
      const topSkills = missingSkills.slice(0, 5);
      suggestions.push(
        `Enhance your resume by adding ${topSkills.join(", ")} with project experience`
      );
    }

    const improved = await generateImprovedResume(
      resumeText,
      jobDesc,
      resumeSkills,
      jobSkills
    );
    await Analysis.create({
      userId: req.user.id,
      jobDescription: jobDesc,

      matchScore,
      matchedSkills,
      missingSkills,
      suggestions,

      improvedResume: {

        summary:
          improved?.improvedResume?.summary || "",


        skills:
          resumeSkills || [],



        experience:

          Array.isArray(improved?.improvedResume?.experience)

            ?

            improved.improvedResume.experience.map(exp => ({

              title: exp.title || "",
              company: exp.company || "",
              duration: exp.duration || "",

              bullets:

                Array.isArray(exp.bullets)
                  ?
                  exp.bullets
                  :
                  []


            }))

            :

            [],





        projects:

          Array.isArray(improved?.improvedResume?.projects)

            ?

            improved.improvedResume.projects.map(project => ({

              name: project.name || project.title || "",

              description: project.description || "",

              live_url: project.live_url || project.liveURL || "",

              github_url: project.github_url || project.githubURL || ""

            }))

            :

            []


      }
    });

    return res.json({

      matchScore,
      matchedSkills,
      missingSkills,
      suggestions,

      improvedResume: {

        summary:
          improved?.improvedResume?.summary || "",

        skills:
          resumeSkills || [],

        experience:
          improved?.improvedResume?.experience || [],

        projects:
          improved?.improvedResume?.projects || []

      }

    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const data = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.deleteHistory = async (req, res) => {
  try {
    const historyId = req.params.id;
    const userId = req.user.id;

    const deletedItem = await Analysis.findOneAndDelete({ _id: historyId, userId: userId });

    if (!deletedItem) {
      return res.status(404).json({ error: "History record not found or unauthorized" });
    }

    return res.json({ success: true, message: "History deleted successfully" });
  } catch (err) {
    console.error("DELETE HISTORY ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};
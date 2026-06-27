const { getEmbedding } = require("./embedding.service");
const { cosineSimilarity } = require("../utils/similarity.util");
const { extractSkillsAI } = require("./aiSkills.service");


exports.matchResumeToJD = async (resumeText, jobDesc) => {
  if (!resumeText || !jobDesc) {
    return { matchScore: 0 };
  }

  try {
    let jdSkills = await extractSkillsAI(jobDesc);

    if (!jdSkills || jdSkills.length === 0) {
      jdSkills = jobDesc
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 4);
    }

    const lowerResume = resumeText.toLowerCase();

    let skillMatchCount = 0;

    jdSkills.forEach(skill => {
      if (lowerResume.includes(skill.toLowerCase())) {
        skillMatchCount++;
      }
    });

    const skillScore =
      jdSkills.length > 0 ? skillMatchCount / jdSkills.length : 0;

    const experienceText = resumeText
      .split("\n")
      .filter(line =>
        line.match(/(developed|built|worked|created|designed|implemented)/i)
      )
      .slice(0, 5)
      .join(" ");

    const projectText = resumeText
      .split("\n")
      .filter(line =>
        line.match(/(project|application|system|app)/i)
      )
      .slice(0, 5)
      .join(" ");

    const [expEmbedding, projEmbedding, jdEmbedding] = await Promise.all([
      getEmbedding(experienceText.substring(0, 1000)),
      getEmbedding(projectText.substring(0, 1000)),
      getEmbedding(jobDesc.substring(0, 1000))
    ]);

    const experienceScore = cosineSimilarity(expEmbedding, jdEmbedding);
    const projectScore = cosineSimilarity(projEmbedding, jdEmbedding);

    let finalScore =
      skillScore * 0.4 +
      experienceScore * 0.4 +
      projectScore * 0.2;

    finalScore = Math.min(Math.max(finalScore * 100, 0), 100);

    return {
      matchScore: Number(finalScore.toFixed(2)),

      sectionScores: {
        skills: Number((skillScore * 100).toFixed(2)),
        experience: Number((experienceScore * 100).toFixed(2)),
        projects: Number((projectScore * 100).toFixed(2))
      }
    };

  } catch (err) {
  console.error("MATCH SERVICE ERROR:", err.message);
  throw new Error("Failed to calculate match score");
}
};
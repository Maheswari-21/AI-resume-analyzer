const { parseResume } = require("../services/resume.service");
const { extractSkillsAI } = require("../services/aiSkills.service");
const { generateSmartResume } = require("../services/aiResume.service");
const stringSimilarity = require("string-similarity");

const skillMap = {
    "node.js": ["node", "nodejs"],
    "javascript": ["js"],
    "react": ["reactjs"],
    "mongodb": ["mongo"]
};
const cleanJSON = (text) => {
    try {
        const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        return match ? JSON.parse(match[0]) : null;
    } catch {
        return null;
    }
};
const normalize = (arr) =>
    [...new Set(arr.map(s => s.toLowerCase().trim()))];

const expandSkills = (skills) => {
    let expanded = [...skills];
    skills.forEach(skill => {
        for (let key in skillMap) {
            if (skill === key || skillMap[key].includes(skill)) {
                expanded.push(key, ...skillMap[key]);
            }
        }
    });
    return [...new Set(expanded)];
};
const isFuzzyMatch = (skill, jdSkills) => {
    return jdSkills.some(jdSkills => {
        const similarity = stringSimilarity.compareTwoStrings(skill, jdSkill);
        return similarity > 0.75;
    });
};
const getSkillWeight = (skill, jdText) => {
    if (jdText.toLowerCase().includes("must") && jdText.include(skill)) return
    if (jdText.toLowerCase().includes("good to have") && jdText.includes(skill))
        return 1;
};
exports.analyze = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "no file uploaded" });
        }
        const jobDesc = req.body.jobDescription;
        if (!jobDesc) {
            return res.status(400).json({ error: "Job description required" });
        }
        const resumeText = await parseResume(req.file.path);
        let resumeSkills = await extractSkillsAI(resumeText) || [];
        let jobSkills = await extractSkillsAI(jobDesc) || [];
        resumeSkills = normalize(resumeSkills);
        jobSkills = normalize(jobSkills);
        const resExpanded = expandSkills(resumeSkills);
        const jdExpanded = expandSkills(jobSkills);

        let matchedSkills = [];
        let missingSkills = [];

        jdExpanded.forEach(jdSkills => {
            const isMatch = resExpanded.includes(jdSkills) ||
                isFuzzyMatch(jdSkills, resExpanded);
            if (isMatch) {
                matchedSkills.push(jdSkills);
            } else {
                missingSkills.push(jdSkills);
            }
        });
        let totalWeight = 0;
        let matchedWeight = 0;
        jdExpanded.forEach(skill => {
            const weight = getSkillWeight(skill, jobDesc);
            totalWeight += weight;

            if (matchedSkills.includes(skill)) {
                matchedWeight += weight
            }
        });
        const matchScore = totalWeight
            ? Math.round((matchedWeight / totalWeight) * 100)
            : 0;
        let aiResult = await generateSmartResume(resumeText, jobDesc, resumeSkills, jobSkills) || {};
        if (typeof aiResult === "string") {
            aiResult = cleanJSON(aiResult) || {};
        }
        return res.json({
            matchScore,
            matchedSkills: [...new set(matchedSkills)],
            missingSkills: [...new set(missingSkills)],
            improvedResume: aiResult.improvedResume || null,
            suggestion: aiResult.suggestions || []
        });
    } catch (err) {
        console.error("FINAL ATS ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
};


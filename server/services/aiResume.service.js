const Groq = require("groq-sdk");


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const cleanJSON = (text) => {

    try {

        const match = text.match(/\{[\s\S]*\}/);

        const data = match
            ? JSON.parse(match[0])
            : {};

        return typeof data === "object" && data !== null
            ? data
            : {};

    } catch {

        return {};

    }

};



exports.generateSmartResume = async (resumeText, jobDesc, resumeSkills = [], jobSkills = []) => {


    try {


        if (!resumeText || !jobDesc || jobDesc.trim().length < 15) {
            return {
                improvedResume: { summary: "", skills: resumeSkills, experience: [], projects: [] },
                missingSkills: [],
                suggestions: ["Invalid or meaningless Job Description provided."]
            };
        }



        const prompt = `
You are a professional ATS resume optimizer.

Your task is to improve resume content for ATS compatibility.

STRICT RULES:
ANTI-FAKE / CRITICAL RULES:
1. If the JOB DESCRIPTION consists of random letters, gibberish (e.g., "asdasd", "qwerty"), or meaningless text, do NOT generate any fake experiences or fake projects. Return empty arrays for experience and projects.
2. Rewrite ONLY existing resume information. Do NOT invent new technologies, companies, achievements, or project names.
3. Do NOT add missing job description skills into the resume fields.

GENERAL:
- Rewrite only existing resume information.
- Preserve original facts.
- Do not invent technologies, companies, achievements, metrics, or experience.
- Do not add new skills.
- Improve professional wording.
- Use strong action verbs.
- Return ONLY valid JSON.


SUMMARY:

- Write only professional introduction.
- Mention role and experience only.
- Do not list technologies.
- Do not mention programming languages.
- Do not mention tools.
- Do not mention skills.
- Maximum 70 words.
- Write only a professional career summary.
- Do not list skills.
- Do not list technologies.
- Do not mention MongoDB, React, Node, JavaScript, tools, or frameworks.
- Do not copy the skills section.
- Mention only role, experience level, and professional focus.
- Keep between 60-80 words.


EXPERIENCE:
- Rewrite experience bullet points professionally.
- Convert weak sentences into strong action statements.
- Improve ATS readability.
- Preserve company name, role, and duration.
- Do not add fake achievements.
- Keep same number of bullet points.
- Experience should contain only company internship/job.
- Do not move project details into experience.
- Do not mention project name as job responsibility.


PROJECTS:

STRICT RULES:

- Always return projects inside "projects" array.
- Never put project details inside experience.
- Preserve project name.
- Preserve URLs.

Each project must have:

title,
description,
liveURL,
githubURL


DESCRIPTION RULE:
PROJECT DESCRIPTION:

- Minimum 80 words.
- Never return one sentence.
- Expand only using resume information.
- Mention frontend, backend, database, authentication only if available.
- Write a detailed ATS friendly paragraph.
- Minimum 120 words.
- Do not write a single sentence.
- Explain:
  - what the project does
  - frontend implementation
  - backend implementation
  - database usage
  - authentication/security
  - API integration

Expand the existing project description into a detailed professional paragraph.
Use all available project information from the resume.
Explain the project purpose, implementation flow, user features, and technical contribution.
Do not remove existing details.
Project description must be 5-7 sentences.

STRICT:
- Do not return technologies field.
- Do not return skills field.
- Do not return framework field.
- Do not create any extra fields.

DESCRIPTION RULE:
- Description must be a detailed ATS friendly paragraph.
- Minimum 120 words.
- Do not make it one sentence.
- Include original project implementation details only.
- Mention technologies naturally inside description if they exist in original resume.
- Include authentication, API integration, CRUD, database handling, security, validation, performance optimization only if available in original resume.
- Keep URLs unchanged.

- Include:
  authentication,
  CRUD operations,
  API development,
  frontend implementation,
  backend integration,
  security,
  validation,
  performance optimization,
  error handling
  only if these are already present in the resume.

- Return only title, description, liveURL, githubURL.
- Do not return technologies array.
- Do not return skills array inside projects.
- Project description should contain technologies naturally if they exist in original resume.
Description:
- Write detailed ATS friendly paragraph.
- Minimum 150 words.
- Include implementation details from original resume.
- Include architecture, frontend, backend, database, authentication, API integration, security, validation, optimization only if mentioned in original resume.
- Preserve project name and URLs.


PROJECT SKILLS RULE:

- Do not create a skills array inside projects.
- Do not return technologies separately.

SKILLS RULE:
- Do not generate skills.
- Do not modify skills.
- Do not add missing job description skills.
- Do not copy skills from JD into resume.
- Skills are handled separately by aiSkills.service.js.
-Skills must come ONLY from the original resume.
-Do not add skills from the job description.
-Do not add missingSkills into skills.
- Include skills only from original resume.
- Do not add skills from job description.
- Do not add missingSkills.
- Do not add new technologies.
- Keep exact resume skills.
- Return skills only from original resume.
- Do not add job description skills.
- Do not add missingSkills.
- Do not add new technologies.

IMPORTANT:
- Skills are handled separately by AI skill extraction system.
- Do not generate skills in this response.



RETURN FORMAT:

{
 "summary":"",
 "experience":[
   {
    "title":"",
    "company":"",
    "duration":"",
    "bullets":[]
   }
 ],
 "projects":[
 {
"title":"",
"description":"",
"liveURL":"",
"githubURL":""
}
],
 "suggestions":[]
}


RESUME:

${resumeText}


JOB DESCRIPTION:

${jobDesc}

`;


        const result = await groq.chat.completions.create({

            model: "llama-3.1-8b-instant",

            messages: [

                {
                    role: "user",
                    content: prompt
                }

            ]

        });



        let responseText =
            result.choices[0].message.content;



        responseText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();




        const parsed = cleanJSON(responseText);

        return {
            improvedResume: {
                summary: parsed.summary || "",
                skills: resumeSkills, 
                experience: Array.isArray(parsed.experience) ? parsed.experience : [], 
                projects: Array.isArray(parsed.projects) ? parsed.projects : [] 
            },
            missingSkills: [],
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
        };

    } catch (err) {
        console.error("GROQ RESUME ERROR:", err.message);

        return {
            improvedResume: {
                summary: "",
                skills: resumeSkills || [],
                experience: [],  
                projects: []    
            },
            missingSkills: [],
            suggestions: []
        };
    }
};
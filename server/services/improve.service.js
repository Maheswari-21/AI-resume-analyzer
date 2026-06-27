const Groq = require("groq-sdk");


if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY");
}


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});



const cleanJSON = (text) => {

  try {

    const match = text.match(/\{[\s\S]*\}/);

    return match
      ? JSON.parse(match[0])
      : {};


  } catch {

    return {};

  }

};



exports.generateImprovedResume = async (
  resumeText,
  jobDesc,
  resumeSkills,
  jobSkills

) => {


  try {


    const result = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      temperature: 0,

      messages: [

        {
          role: "user",

          content: `

You are an ATS resume optimizer.
SUMMARY RULES:
- Write only a professional career summary.
- Do not list skills.
- Do not list technologies.
- Do not mention MongoDB, React, Node, JavaScript, tools, or frameworks.
- Do not copy the skills section.
- Mention only role, experience level, and professional focus.
- Keep between 60-80 words.
- Write only professional introduction.
- Mention role and experience only.
- Do not list technologies.
- Do not mention programming languages.
- Do not mention tools.
- Do not mention skills.
- Maximum 70 words.
- Summary minimum 80 words.
- Maximum 120 words.
- Write only professional introduction.
- Do not create a skills list.
- Do not repeat all technologies.
- Mention role, experience, and development work naturally.
- Avoid listing tools like Git, GitHub, VS Code, Postman, Chrome DevTools.
- Make it ATS friendly.
Rules:
- Always return live_url and github_url fields.
- Keep URLs exactly from resume.
- Never remove URLs.
- If unavailable return empty string.
- Do not add fake skills.
- Do not invent experience.
- Improve only existing resume.
- Return only JSON.
- Projects must always be detailed.
- Project description minimum 100 words.
- Never return one sentence.
- Expand the project using only information available in resume.
- Include:
  - project purpose
  - frontend implementation
  - backend implementation
  - database usage
  - API integration
  - authentication
  - CRUD operations
  - validation
  - error handling

Do not shorten project description.
Do not summarize.
PROJECT TECHNOLOGY RULES:

- Return technologies array for every project.
- Technologies must come only from original resume.
- Do not invent new technologies.
- Keep technologies separate from description.

FORMAT:

{
"summary":"",
"experience":[
 {
  "company":"",
  "position":"",
  "duration":"",
  "responsibilities":[]
 }
],
"projects":[
 {
  "name":"",
  "description":"",
  "technologies":[],
  "live_url":"",
  "github_url":""
 }
]
}


VERY IMPORTANT:

- Internship / job / company details ONLY inside experience.
- Personal projects ONLY inside projects.
- Never put project inside experience.
- Never put experience inside projects.
- If resume contains project named  it MUST go inside projects array.
- Experience array should contain only companies/jobs/internships.

${resumeText}


JOB DESCRIPTION:

${jobDesc}


CURRENT SKILLS:

${JSON.stringify(resumeSkills)}


JOB SKILLS:

${JSON.stringify(jobSkills)}

`
        }

      ]


    });



    let response =
      result.choices[0].message.content;



    const parsed = cleanJSON(response);



    console.log("GROQ IMPROVED RAW:", response);


    return {

      improvedResume: {

        summary: parsed.summary || "",

        experience: Array.isArray(parsed.experience)
          ? parsed.experience
          : [],


        projects: Array.isArray(parsed.projects)
          ? parsed.projects
          : []

      },

      suggestions:

        Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : []

    };

  } catch (err) {






    return {

      improvedResume: {
        "summary": "",
        "experience": [
        ],
        "projects": [
        ],
        "suggestions": []
      }

    };


  }


};
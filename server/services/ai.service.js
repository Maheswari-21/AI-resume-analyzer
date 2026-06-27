const Groq = require("groq-sdk");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});



async function generateWithRetry(prompt) {

  try {

    return await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "user",
          content: prompt
        }
      ]

    });


  } catch (err) {


    console.error("Groq error:", err.message);
    return null;

  }

}






exports.generateResumeImprovement = async (

  resumeText,
  experienceLines,
  projectLines

) => {


  try {


    const prompt = `


You are an ATS resume optimizer.


Rewrite the resume sections.


STRICT RULES:


SUMMARY:

- Use ONLY information from resume.
- Do not add new skills.
- Do not add claims.
- Keep 70-90 words.


EXPERIENCE:

- Rewrite only given experience lines.
- Improve grammar.
- Do not add technologies.
- Do not add achievements.
- Keep same number of lines.


PROJECTS:

- Rewrite only given project lines.
- Do not invent technologies.
- Preserve project name.
- Improve grammar.
- Keep same number of bullets.


Return ONLY valid JSON.

Always follow this exact structure:

{
 "summary": "",
 "skills": [],
 "experience": [
   {
    "company": "",
    "position": "",
    "duration": "",
    "responsibilities": []
   }
 ],
 "projects": [
   {
    "name": "",
    "description": "",
    "technologies": [],
    "live_url": "",
    "github_url": ""
   }
 ]
}

If any information is missing, return empty string or empty array.
Do not remove fields.
${resumeText}



EXPERIENCE:

${JSON.stringify(experienceLines)}



PROJECTS:

${JSON.stringify(projectLines)}



`;



    const result = await generateWithRetry(prompt);



    if (!result) {


      return {

        summary: "",
        experience: experienceLines,
        projects: projectLines

      };


    }



    let text =
      result.choices[0].message.content;



    text = text.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();



    return JSON.parse(text);



  }

  catch (err) {


    console.error(
      "GROQ RESUME ERROR:",
      err.message
    );


    return {

      summary: "",
      experience: experienceLines,
      projects: projectLines

    };


  }


};
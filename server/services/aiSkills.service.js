
const Groq = require("groq-sdk");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


const cleanJSON = (text) => {

  try {

    const match = text.match(/\{[\s\S]*\}/);

    const data = match ? JSON.parse(match[0]) : {};

    return {

      technical: Array.isArray(data.technical)
        ? data.technical
        : [],

      domain: Array.isArray(data.domain)
        ? data.domain
        : [],

      soft: Array.isArray(data.soft)
        ? data.soft
        : []

    };


  } catch {

    return {
      technical: [],
      domain: [],
      soft: []
    };

  }

};


const normalizeArray = (arr = []) => {

  return [
    ...new Set(
      arr
        .map(s => s.toLowerCase().trim())
        .filter(Boolean)
    )
  ];

};


const mergeSkills = (obj) => {

  return [
    ...obj.technical,
    ...obj.domain,
    ...obj.soft
  ];

};



exports.extractSkillsAI = async (text) => {


  try {


    if (!text || typeof text !== "string")
      return [];



    const result =
      await groq.chat.completions.create({

        model: "llama-3.1-8b-instant",

        temperature: 0,

        messages: [
          {
            role: "user",

            content: `

You are an ATS skill extraction system.

Extract skills ONLY from the provided TEXT.

RULES:

- Extract only:
  programming languages,
  frameworks,
  libraries,
  databases,
  tools,
  platforms,
  APIs,
  technologies,
  certifications.

- Do NOT extract:
  responsibilities,
  sentences,
  achievements,
  generic words.
  
  - Do NOT extract actions or concepts:
  debugging,
  performance optimization,
  api integration,
  crud operations,
  user authentication,
  responsive design,
  testing,
  issue resolution.

- Extract only actual technologies/tools/frameworks/languages/databases.

- Do not invent skills.
- Do not guess missing skills.
- Return only skills that exist in TEXT.
- Keep skill names clean.
- Do not generate skills.
- Return skills as empty array.
- Skills are handled separately.

Return ONLY JSON:

{
 "technical":[],
 "domain":[],
 "soft":[]
}


TEXT:

${text}

`
          }

        ]


      });



    const responseText =
      result.choices[0].message.content;







    const parsed =
      cleanJSON(responseText);



    return normalizeArray(
      mergeSkills(parsed)
    );



  } catch (err) {


    console.error(
      "GROQ SKILL ERROR:",
      err.message
    );


    return [];


  }



};
const Groq = require("groq-sdk");


const groq = new Groq({

    apiKey: process.env.GROQ_API_KEY

});


exports.improveResume = async (text) => {


    const result =
        await groq.chat.completions.create({

            messages: [

                {
                    role: "user",
                    content:
                        `Improve this resume professionally:

${text}`
                }

            ],


            model: "llama-3.1-8b-instant"


        });


    return result.choices[0].message.content;


};
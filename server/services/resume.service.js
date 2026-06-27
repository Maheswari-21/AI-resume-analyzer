const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;
const fs = require("fs/promises");

exports.parseResume = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    console.error("PARSE ERROR:", err.message);
    throw err;
  }
};
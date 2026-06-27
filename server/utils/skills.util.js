exports.extractSkills = (text = "") => {

  const cleanText = text.toLowerCase();


  const skillsDatabase = [

    // Programming / IT
    "javascript",
    "typescript",
    "python",
    "java",
    "c++",
    "c#",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "mongodb",
    "sql",
    "mysql",
    "postgresql",
    "html",
    "css",
    "docker",
    "aws",
    "azure",
    "git",

    // Data / AI
    "machine learning",
    "deep learning",
    "data analysis",
    "python",
    "tensorflow",
    "pandas",
    "excel",
    "power bi",
    "tableau",

    // Business
    "project management",
    "leadership",
    "communication",
    "negotiation",
    "sales",
    "marketing",
    "digital marketing",
    "customer service",

    // Finance
    "accounting",
    "financial analysis",
    "budgeting",
    "taxation",
    "bookkeeping",

    // HR
    "recruitment",
    "talent acquisition",
    "payroll",
    "employee relations",

    // Design
    "ui design",
    "ux design",
    "figma",
    "photoshop",

    // Engineering
    "autocad",
    "solidworks",
    "cad",
    "quality control",
    "manufacturing",

    // Common tools
    "excel",
    "word",
    "powerpoint",
    "communication",
    "teamwork",
    "problem solving"

  ];


  return skillsDatabase.filter(skill => {

    const escapedSkill = skill.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );


    const regex = new RegExp(
      `\\b${escapedSkill}\\b`,
      "i"
    );


    return regex.test(cleanText);

  });

};
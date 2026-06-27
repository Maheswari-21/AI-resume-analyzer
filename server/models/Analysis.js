const mongoose = require("mongoose");


const analysisSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },


  matchScore: Number,


  matchedSkills: [
    String
  ],


  missingSkills: [
    String
  ],


  improvedResume: {


    summary: String,


    skills: [
      String
    ],


    experience: [
      mongoose.Schema.Types.Mixed
    ],


    projects: [
      mongoose.Schema.Types.Mixed
    ]

  },


  suggestions: [
    String
  ],


  createdAt: {
    type: Date,
    default: Date.now
  }


});


module.exports = mongoose.model(
  "Analysis",
  analysisSchema
);
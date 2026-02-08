const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const feedbackSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HOSPITAL_DETAILS",
      required: true,
      index: true,
    },

    feedback_name: {
      type: String,
      required: true,
      trim: true,
    },

    questions: {
      type: [questionSchema], // 🔥 ARRAY OF QUESTIONS
      
      required: true,
    },

    logo_png: {
      type: String, // base64 / URL
      
      required:true
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    concern_person_detail_1: {
      type: String,
      default: null, // ✅ nullable
    },

    concern_person_detail_2: {
      type: String,
      default: null, // ✅ nullable
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FEEDBACK", feedbackSchema);

const mongoose = require("mongoose");

// FEEDBACK model
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },

  answerType: {
    type: String,
    // Allowed types for questions (image supported via mediaUrl)
    enum: ["text", "rating", "audio", "video", "image", "radio"],
    required: true,
  },

  options: {
    type: [String], // only for radio
    default: [],
  },

  isActive: { type: Boolean, default: true },
});

const responseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  answerType: {
    type: String,
    // Must match what the frontend can send
    enum: ["text", "rating", "audio", "video", "image", "radio"],
    required: true,
  },

  // 👇 only ONE of these will be filled depending on answerType
  answerText: String,        // text
  ratingValue: Number,       // rating
  mediaUrl: String,          // audio/video/img
  selectedOption: String,    // radio
});

const feedbackResponseSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FEEDBACK",
      required: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HOSPITAL_DETAILS",
      required: true,
    },

    responses: [responseSchema], // 🔥 ALL ANSWERS HERE

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.FEEDBACK_RESPONSE ||
  mongoose.model("FEEDBACK_RESPONSE", feedbackResponseSchema);

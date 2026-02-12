const mongoose = require("mongoose");

const feedbackResponseSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FEEDBACK",
      required: true,
      index: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HOSPITAL_DETAILS",
      required: true,
      index: true,
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    // optional (future)
    source: {
      type: String,
      default: "QR",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FEEDBACK_RESPONSE", feedbackResponseSchema);

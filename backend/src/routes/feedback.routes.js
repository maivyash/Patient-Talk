const express = require("express");
const router = express.Router();

const FeedbackQuestion = require("../models/feedbackQuestionSchema");
const authMiddleware = require("../middleware/auth");

// CREATE FEEDBACK FORM
router.post("/feedback/newFeedback", authMiddleware, async (req, res) => {
  try {
    const { hospitalId, feedbackName, questions, concernPersons } = req.body;

    // Validation
    if (!hospitalId || !feedbackName || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const feedbackForm = new FeedbackQuestion({
      hospitalId,
      feedbackName,
      questions,
      concernPersons,
    });

    await feedbackForm.save();

    return res.status(201).json({
      success: true,
      feedback_id: feedbackForm._id,
      message: "Feedback form created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;

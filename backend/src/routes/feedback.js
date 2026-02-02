const express = require("express");
const router = express.Router();
const FeedbackQuestion = require("../models/feedbackQuestionSchema");
const authMiddleware = require("../middleware/auth");

router.get("/feedback/:feedbackId", authMiddleware, async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      const feedbackForm = await FeedbackQuestion.findById(feedbackId)
        .populate("concernPersons");
  
      if (!feedbackForm || !feedbackForm.isActive) {
        return res.status(404).json({
          success: false,
          message: "Feedback form not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: feedbackForm,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });

module.exports = router;
  
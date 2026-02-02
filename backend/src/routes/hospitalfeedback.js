const express = require("express");
const router = express.Router();
const FeedbackQuestion = require("../models/feedbackQuestionSchema");
const authMiddleware = require("../middleware/auth");

router.get(
    "/hospitalfeedback/:hospitalId",
    authMiddleware,
    async (req, res) => {
      try {
        const { hospitalId } = req.params;
  
        const feedbackForms = await FeedbackQuestion.find({
          hospitalId,
          isActive: true,
        }).populate("concernPersons");
  
        return res.status(200).json({
          success: true,
          data: feedbackForms,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    }
  );

module.exports = router;
  
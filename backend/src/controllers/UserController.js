const FEEDBACK = require("../models/Feedback"); 


async function getFeedbackByIdforUser(req, res) {
  const feedback = await FEEDBACK.findOne({
    _id: req.params.id,
    isActive: true,
  }).select("feedback_name questions logo_png");

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: "Feedback form closed or not found",
    });
  }

  res.status(200).json({
    success: true,
    data: feedback,
  });
}

async function submitFeedbackForUser(req, res) {
  const { answers } = req.body;

  if (!answers || answers.length === 0) {
    return res.status(400).json({ message: "Answers required" });
  }

  const feedback = await FEEDBACK.findById(req.params.id);

  if (!feedback || !feedback.isActive) {
    return res.status(400).json({
      message: "Feedback is closed",
    });
  }

  await FEEDBACK_RESPONSE.create({
    feedbackId: feedback._id,
    hospitalId: feedback.hospitalId,
    answers,
  });

  res.status(200).json({
    success: true,
    message: "Thank you for your feedback",
  });
}



module.exports = { getFeedbackByIdforUser, submitFeedbackForUser };
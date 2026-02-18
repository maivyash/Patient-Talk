const FEEDBACK = require("../models/feedback"); 
const FEEDBACK_RESPONSE = require("../models/FeedbackResponses");

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
  try {
    const feedbackId = req.params.id;
    const responses = JSON.parse(req.body.responses); // multipart

    const feedback = await FEEDBACK.findOne({
      _id: feedbackId,
      isActive: true,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback closed or not found",
      });
    }

    // Map uploaded files by fieldname
    const fileMap = {};
    (req.files || []).forEach((file) => {
      fileMap[file.fieldname] = `/uploads/${file.destination.split("uploads/")[1]}/${file.filename}`;
    });

    const formattedResponses = responses.map((r) => ({
      questionId: r.questionId,
      answerType: r.answerType,
      answerText: r.answerText || null,
      ratingValue: r.ratingValue || null,
      mediaUrl: fileMap[r.fileKey] || null,
    }));

    await FEEDBACK_RESPONSE.create({
      feedbackId: feedback._id,
      hospitalId: feedback.hospitalId,
      responses: formattedResponses,
    });

    return res.status(200).json({
      success: true,
      message: "Thank you for your feedback",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}





module.exports = { getFeedbackByIdforUser, submitFeedbackForUser };
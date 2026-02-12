const express = require("express");
const mongoose = require("mongoose");
const FEEDBACK = require("../models/feedback");
const { get } = require("mongoose");
const HOSPITAL_DETAILS = require("../models/HOSPITAL_DETAILS");
const { generateFeedbackQR } = require("../helpers/QRgenerator");




 async function getFeedbacksByHospital(req, res) {
  try {
    const feedbacks = await FEEDBACK.find({
      hospitalId: req.hospitalId,
      isActive: true,
    });

    return res.json({
      success: true,
      data: feedbacks,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
    console.error("Error fetching feedbacks:", err);
  }
};

async function getHospitalProfile(req, res) {
  try {
    const hospitalProfile = await HOSPITAL_DETAILS.findById(req.hospitalId).select("+hospital_logo +hospital_name");
    if (!hospitalProfile) {
      return res.status(404).json({ success: false, message: "Hospital profile not found" });
    }
    if (!hospitalProfile.hospital_name) {
      hospitalProfile.hospital_name = "Your Hospital Name";
    } 
    if (!hospitalProfile.hospital_logo) {
      hospitalProfile.hospital_logo = "https://via.placeholder.com/150?text=Hospital+Logo";
    }
    let logoBase64 = null;

    if (hospitalProfile.hospital_logo?.data) {
      const buffer = hospitalProfile.hospital_logo.data;
      const mime = hospitalProfile.hospital_logo.contentType || "image/png";

      logoBase64 = `data:${mime};base64,${buffer.toString("base64")}`;
    }
    return res.json({
      success: true,
      data: {hospital_name: hospitalProfile.hospital_name, hospital_logo: logoBase64},
    });
  } catch (err) {
    console.error("Error fetching hospital profile:", err);
    return res.status(500).json({ message: "Server error" });
    
  } 

}

async function changeHospitalName(req, res) {
  try {
    const hospitalId = req.hospitalId;
    const { newHospital_name } = req.body;

    const updatedHospital = await HOSPITAL_DETAILS.findByIdAndUpdate(
      hospitalId,
      { hospital_name: newHospital_name },
      { new: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedHospital,
    });
  } catch (err) {
    console.error("Error updating hospital name:", err);
    return res.status(500).json({ message: "Server error" });
  }
}




async function createFeedback(req, res) {
  try {
    const { department_name, questions, logo_png } = req.body;
    
    if (!department_name) {
      return res.status(400).json({ message: "Department name required" });
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(401).json({ message: "At least one question required" });
    }
    if (!logo_png) {
      return res.status(401).json({ message: "Department logo required" });
    }
    
    
    const feedback = await FEEDBACK.create({
      hospitalId: new mongoose.Types.ObjectId(req.hospitalId),
      feedback_name: `${department_name}`,
      questions: questions || [],
      logo_png, // base64 image
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getFeedbackById(req, res) {    // GET /admin/getfeedbackform/:id
                                              //get feedback by Feedback ID and hospital ID, return 404 if not found
  const feedback = await FEEDBACK.findOne({
    _id: req.params.id,
    hospitalId: req.hospitalId,
  });

  if (!feedback) {
    return res.status(404).json({ success: false });
  }

  res.status(200).json({ success: true, data: feedback });
}



async function updateFeedbackById(req, res) {  // PUT /admin/feedback/:id
                                               //update feedback by Feedback ID and hospital ID, return 404 if not found
  const { questions, isActive } = req.body;

  await FEEDBACK.updateOne(
    { _id: req.params.id, hospitalId: req.hospitalId },
    { $set: { questions, isActive } }
  );

  res.status(200).json({ success: true });

}
async function deleteFeedbackById(req, res) {  // DELETE /admin/feedback/:id
                                               //delete feedback by Feedback ID and hospital ID, return 404 if not found
try{  await FEEDBACK.deleteOne(
    { _id: req.params.id, hospitalId: req.hospitalId }
  );


  res.status(200).json({ success: true });
}catch(err){
  res.status(500).json({ success: false, message: "Error deleting feedback" });
}}


 async function getFeedbackQR(req, res) {
    const feedback = await FEEDBACK.findOne({
      _id: req.params.id,
      hospitalId: req.hospitalId,
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const { qrBase64 } = await generateFeedbackQR(feedback._id);

    res.status(200).json({
      success: true,
      qr: qrBase64,
    });
  }
module.exports = { getFeedbacksByHospital, getHospitalProfile, changeHospitalName, createFeedback, getFeedbackById,updateFeedbackById,deleteFeedbackById, getFeedbackQR };
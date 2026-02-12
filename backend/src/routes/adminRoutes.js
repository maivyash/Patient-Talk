const express = require("express");
const authcontroller = require("../middleware/auth");
const { getFeedbacksByHospital, getHospitalProfile, changeHospitalName, createFeedback, getFeedbackById, updateFeedbackById, deleteFeedbackById, getFeedbackQR } = require("../controllers/adminRoutesController");

const router = express.Router();

router.get("/getFeedbackForms", authcontroller, getFeedbacksByHospital);
router.get("/hospital/profile", authcontroller, getHospitalProfile);
router.put("/hospital/changeHospitalName", authcontroller, changeHospitalName);
router.post("/hospital/createFeedback", authcontroller, createFeedback);
router.get("/getfeedbackform/:id", authcontroller, getFeedbackById);
router.put("/updatefeedbackform/:id", authcontroller, updateFeedbackById);
router.delete("/deletefeedbackform/:id", authcontroller, deleteFeedbackById)
router.get("/feedback/:id/qr",authcontroller,getFeedbackQR);





module.exports = router;
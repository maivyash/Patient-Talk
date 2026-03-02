const express = require("express");
const UserRouter = express.Router();
const { getFeedbackByIdforUser, submitFeedbackForUser, getHospitalProfileForUser, getHospitalAllFeedbackByIdforUser, getFeedbackResponseByToken } = require("../controllers/userController");   
const upload = require("../middleware/upload");

UserRouter.get("/getFeedbackByIdForUser/:id", getFeedbackByIdforUser);
UserRouter.post("/submitFeedbackForUser/:id",upload.any(), submitFeedbackForUser);
UserRouter.get("/getHospitalProfileForUser/:id", getHospitalProfileForUser);
UserRouter.get("/getHospitalFeedbacksFormForUser/:id", getHospitalAllFeedbackByIdforUser);
UserRouter.get("/getFeedbackResponsesByToken/:token", getFeedbackResponseByToken);


module.exports = UserRouter;
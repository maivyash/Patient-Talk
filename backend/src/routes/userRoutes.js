const express = require("express");
const UserRouter = express.Router();
const { getFeedbackByIdforUser, submitFeedbackForUser } = require("../controllers/userController");   
const upload = require("../middleware/upload");

UserRouter.get("/getFeedbackByIdForUser/:id", getFeedbackByIdforUser);
UserRouter.post("/submitFeedbackForUser/:id",upload.any(), submitFeedbackForUser);


module.exports = UserRouter;
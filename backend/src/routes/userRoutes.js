const express = require("express");
const UserRouter = express.Router();
const { getFeedbackByIdforUser, submitFeedbackForUser } = require("../controllers/userController");   

UserRouter.get("/getFeedbackByIdForUser/:id", getFeedbackByIdforUser);
UserRouter.post("/submitFeedbackForUser/:id", submitFeedbackForUser);


module.exports = UserRouter;
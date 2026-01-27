const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Signup (new registration)
router.post("/signup", signup);

// Login using email and password
router.post("/login", login);

module.exports = router;


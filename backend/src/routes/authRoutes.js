const express = require("express");
const { signup, login, superadminLogin } = require("../controllers/authController");

const router = express.Router();

// Signup (new registration)
router.post("/signup", signup);

// Login using email and password
router.post("/login", login);

//super admin login 
router.post("/superadmin/login",superadminLogin);


module.exports = router;


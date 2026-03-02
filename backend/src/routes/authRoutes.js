const express = require("express");
const { signup, login, superadminLogin, logout } = require("../controllers/authController");

const router = express.Router();

// Signup (new registration)
router.post("/signup", signup);

// Login using email and password
router.post("/login", login);
router.post("/logout", logout);


//super admin login 
router.post("/superadmin/login",superadminLogin);


module.exports = router;


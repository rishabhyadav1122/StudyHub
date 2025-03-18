const express = require('express');
const { registerUser, verifyEmail, loginUser } = require("../controllers/authController.js")

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);

module.exports = router
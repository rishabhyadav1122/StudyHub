const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/Stats", authMiddleware, getDashboardStats);

module.exports = router;

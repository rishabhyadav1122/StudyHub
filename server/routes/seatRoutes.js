const express = require("express");
const { initializeHub,getAllSeats,getAvailableSeats, getHubConfig, updateHubConfig } = require("../controllers/seatController");
const  authMiddleware  = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/initializeHub", authMiddleware, initializeHub);
router.get("/getConfig", authMiddleware, getHubConfig);
router.get("/getAllSeats", authMiddleware, getAllSeats);
router.get("/getAvailableSeats", authMiddleware, getAvailableSeats);
router.put("/updateConfig", authMiddleware,  updateHubConfig);

// Export
module.exports = router;

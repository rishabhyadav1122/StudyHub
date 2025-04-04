const express = require("express");
const { addStudent,getAllStudents, getStudent, submitFees, removeStudent } = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes (Protected by Auth Middleware)
router.post("/addStudent", authMiddleware, addStudent);
router.get("/getAllStudents",authMiddleware, getAllStudents);
router.get("/getAllTransactions",authMiddleware, getAllStudents);
router.get("/:seatId", authMiddleware, getStudent);
router.get("/:seatId/getStudentTransactions", authMiddleware, getStudent);
router.put("/:seatId/submitFees", authMiddleware, submitFees);
router.delete("/:seatId/removeStudent", authMiddleware, removeStudent);

module.exports = router;

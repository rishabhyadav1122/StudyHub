const Student = require("../models/Student");
const Seat = require("../models/Seat");

// 📍 Assign a Student to an Available Seat
const addStudent = async (req, res) => {
    try {
      const { seatId, name, gender, mobile, address } = req.body;
      const managerId = req.user.id; // ✅ Extract manager's ID from token
      
      // Check if all required fields are provided
      if (!seatId || !name || !gender || !mobile || !address) {
        return res.status(400).json({ message: "All fields are required" , success:false });
      }
  
      // Find the selected seat by seatId (String ID)
      const seat = await Seat.findOne({ seatId: seatId, isOccupied: false });
      if (!seat) {
        return res.status(400).json({ message: "Seat is either occupied or does not exist" , success:false});
      }
  

      if (!seat._id) {
        return res.status(400).json({ message: "Invalid seat ID" ,success:false});
      }
  
      // Use the seat's feePerMonth as dueFees if not provided in request
      const studentDueFees = seat.feePerMonth;
  
      // Create a new student and link the seat
      const newStudent = new Student({
        seatId: seat._id, // Store ObjectId
        seatNumber: seat.seatId, // Store Seat Number as string
        name,
        gender,
        mobile,
        address,
        dueFees: studentDueFees, // Assign dueFees
        manager: managerId // ✅ Store manager's ID
      });
      const savedStudent = await newStudent.save();
  
      // Mark seat as occupied & store student reference
      seat.isOccupied = true;
      seat.student = newStudent._id;
      await seat.save();

      res.status(201).json({ 
        message: `Student assigned to seat ${seat.seatId}`, 
        data: savedStudent ,
        success:true
      });

    } catch (error) {
      console.error("Error adding student:", error);
      res.status(500).json({ message: "Internal server error", error: error.message , success:false});
    }
  };

// 📍 Get Student Details by Seat ID
const getStudent = async (req, res) => {
    try {
      const { seatId } = req.params;
  
      // Find seat and populate student details
      const seat = await Seat.findOne({ seatId, manager: req.user.id }).populate("student");
      if (!seat || !seat.student) {
        return res.status(404).json({ message: "Seat is empty or unauthorized access" , success:false});
      }
    
      res.status(200).json({
        student : seat.student,
        success:true
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving student", error });
    }
  };
  
  // 📍 Submit Fees for a Student
  const submitFees = async (req, res) => {
    try {
      const { seatId } = req.params;
      const { amount } = req.body;
  
      // Find seat and student
      const seat = await Seat.findOne({ seatId, manager: req.user.id }).populate("student");
      if (!seat || !seat.student) {
        return res.status(404).json({ message: "Seat is empty or unauthorized access" });
      }
  
      // Update due fees and transaction history
      const student = seat.student;
      student.dueFees -= amount;
      student.transactions.push({ amount });
  
      await student.save();
  
      res.status(200).json({ message: "Payment recorded", student });
    } catch (error) {
      res.status(500).json({ message: "Error submitting fees", error });
    }
  };
  
  // 📍 Remove Student & Vacate Seat
  const removeStudent = async (req, res) => {
    try {
      const { seatId } = req.params;
  
      // Find seat and student
      const seat = await Seat.findOne({ seatId, manager: req.user.id }).populate("student");
      if (!seat || !seat.student) {
        return res.status(404).json({ message: "No student found in this seat or unauthorized access" });
      }
  
      // Remove student record
      await Student.findByIdAndDelete(seat.student._id);
  
      // Mark seat as available again
      seat.isOccupied = false;
      seat.student = null;
      await seat.save();
  
      res.status(200).json({ message: `Seat ${seatId} is now vacant` });
    } catch (error) {
      res.status(500).json({ message: "Error removing student", error });
    }
  };

const getAllStudents = async (req, res) => {
    try {

        const students = await Student.find({ manager: req.user.id }); // ✅ Filter students by manager
    
        res.status(200).json(students);
      } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
      }
  };

  const getAllTransactions = async (req, res) => {
    try {
      const managerId = req.user.id;
  
      // Fetch all students managed by the logged-in manager
      const students = await Student.find({ manager: managerId });
  
      // Extract transactions from each student
      const transactions = students.flatMap(student =>
        student.transactions.map(transaction => ({
          studentName: student.name,
          studentId: student._id,
          amount: transaction.amount,
          date: transaction.date,
        }))
      );
  
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching transactions" });
    }
  };

  
  const getStudentTransactions = async (req, res) => {
    try {
      const managerId = req.user.id;
      const { seatId } = req.params;
      
      // Fetch all students managed by the logged-in manager
      const students = await Student.find({ seatId , manager: managerId });
  
      // Extract transactions from each student
      const transactions = students.flatMap(student =>
        student.transactions.map(transaction => ({
          studentName: student.name,
          studentId: student._id,
          amount: transaction.amount,
          date: transaction.date,
        }))
      );
  
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching transactions" });
    }
  };
  

module.exports = { addStudent, getStudent,getAllStudents, submitFees, removeStudent , getAllTransactions , getStudentTransactions};

const Seat = require("../models/Seat");
const Student = require("../models/Student");
const HubConfig = require("../models/HubConfig");

const getDashboardStats = async (req, res) => {
  try {
    const managerId = req.user.id;

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get total seats owned by the manager
    const totalSeats = await Seat.countDocuments({ manager: managerId });

    // Get occupied and available seats
    const occupiedSeats = await Seat.countDocuments({ manager: managerId, isOccupied: true });
    const availableSeats = totalSeats - occupiedSeats;

    // Count total students
    const totalStudents = await Student.countDocuments({ manager: managerId });

    // Get all students to calculate fee stats
    const students = await Student.find({ manager: managerId });
    const hubConfig = await HubConfig.find({ manager: managerId });

    let totalFeesCollected = 0;
    let totalFeesPending = 0;
    let recentTransactions = [];

    students.forEach(student => {
      // Calculate monthly pending fees (current month's due)
      const monthlyDue = hubConfig.feePerMonth; // Assuming you have monthlyFee field
      const paidThisMonth = student.transactions
        .filter(t => {
          const transDate = new Date(t.date);
          return transDate.getMonth() === currentMonth && 
                 transDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      totalFeesPending += Math.max(0, monthlyDue - paidThisMonth);

      // Process transactions for collected fees and recent transactions
      student.transactions.forEach(transaction => {
        const transDate = new Date(transaction.date);
        if (transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear) {
          totalFeesCollected += transaction.amount;
        }
        recentTransactions.push({
          studentName: student.name,
          studentSeat: student.seatNumber,
          amount: transaction.amount,
          date: transaction.date
        });
      });
    });

    // Sort transactions by date (latest first) and get the last 5
    recentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentTransactions = recentTransactions.slice(0, 5);

    res.json({
      totalSeats,
      occupiedSeats,
      availableSeats,
      totalStudents,
      totalFeesCollected,
      totalFeesPending,
      recentTransactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardStats };
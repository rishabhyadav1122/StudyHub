const cron = require("node-cron");
const Student = require("./models/Student");
const Seat = require("./models/Seat");

// Function to check and update due fees for students completing one month
async function updateDueFees() {
  try {
    console.log("Checking students for due fees update...");

    // Get today's date
    const today = new Date();

    // Find students who have completed one month since their last due fee update
    const students = await Student.find({
      lastFeeUpdate: { $lte: new Date(today.setMonth(today.getMonth() - 1)) } // Students whose last fee update was a month ago
    }).populate("seatId");

    for (let student of students) {
      // Find the seat's monthly fee
      const seat = await Seat.findById(student.seatId);
      if (!seat) continue;

      // Increase due fees by seat's monthly fee
      student.dueFees += seat.feePerMonth;

      // Update last fee update date to today
      student.lastFeeUpdate = new Date();

      await student.save();
    }

    console.log(`✅ Due fees updated for ${students.length} students.`);
  } catch (error) {
    console.error("❌ Error updating due fees:", error);
  }
}

// Schedule cron job to run every night at 12:00 AM
cron.schedule("0 0 * * *", updateDueFees);

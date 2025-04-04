const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true , unique: true  }, // ✅ Link with Seat model
  seatNumber: { type: String, required: true }, // ✅ Store seatId as string for easy reference
  name: { type: String, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  lastFeeUpdate: { type: Date, default: Date.now }, // Track last due fees update
  dueFees: { type: Number, required: true }, // Fees yet to be paid
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } , // Manager who owns the hub
  transactions: [
    {
      amount: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Student", studentSchema);


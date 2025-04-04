const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, // Unique Seat ID (e.g., S001, S002)
  isOccupied: { type: Boolean, default: false }, // Seat availability
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null }, // If occupied, store student ID
  feePerMonth: { type: Number, required: true }, // Monthly seat fee
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Manager who owns the seat
});

module.exports = mongoose.model("Seat", SeatSchema);

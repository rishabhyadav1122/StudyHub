const mongoose = require("mongoose");

const hubConfigSchema = new mongoose.Schema({
  totalSeats: { type: Number, required: true },
  feePerMonth: { type: Number, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Manager who owns the hub
}); 

module.exports = mongoose.model("HubConfig", hubConfigSchema);

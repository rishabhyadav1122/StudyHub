const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for Google auth
    googleId: { type: String }, // Stores Google user ID
    isVerified: { type: Boolean, default: false }, // Email verification status
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

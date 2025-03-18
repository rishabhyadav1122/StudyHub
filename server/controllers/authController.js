const  User =  require("../models/User.js");
const bcrypt =  require("bcryptjs");
const  jwt =  require("jsonwebtoken");
const dotenv =  require("dotenv");
const { z } = require('zod');
const  sendEmail =  require("../utils/sendEmail.js");

dotenv.config();

// Zod Schema for Signup Validation
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register User
const registerUser = async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const { name, email, password } = validatedData;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    await sendEmail(user.email, "Verify Your Email", `Click to verify: http://localhost:5173/verify/${token}`);

    res.status(201).json({ message: "User registered. Check email for verification." });
  } catch (error) {
    res.status(400).json({ message: error.errors || "Invalid data" });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified) return res.status(403).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: "Login failed" });
  }
};

module.exports = {registerUser , verifyEmail , loginUser}

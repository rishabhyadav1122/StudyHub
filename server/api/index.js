const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); // Adjust the path as needed
const authRoutes = require("./routes/authRoutes.js")
const passport = require("passport")
const session = require("express-session")
require("../config/passport.js")
const seatRoutes = require("../routes/seatRoutes.js");
const studentRoutes = require("../routes/studentRoute.js");
const dashboardRoutes = require("../routes/dashboardRoutes.js")



// Import the cron job
require("../cronJobs.js");


// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: 'https://study-hub-mq4a.vercel.app', credentials: true })); // Adjust based on frontend URL
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);

//Google OAuth
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

// Basic route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Study Point Hub API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
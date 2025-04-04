const Seat = require("../models/Seat");
const HubConfig = require("../models/HubConfig");

// ✅ Initialize Hub Config (Only Once, for First Time Setup)
const initializeHub = async (req, res) => {
    try {
      const { totalSeats, feePerMonth } = req.body;
      const existingConfig = await HubConfig.findOne({ manager: req.user.id });
  
      if (existingConfig) {
        return res.status(400).json({ message: "Hub is already initialized. Use update API." , success:false});
      }
  
      // Create seats
      let seats = [];
      for (let i = 1; i <= totalSeats; i++) {
        let seatId = `S${String(i).padStart(3, "0")}`; // S001, S002, ...
        seats.push({ seatId, feePerMonth, manager: req.user.id });
      }
  
      await Seat.insertMany(seats);
      await HubConfig.create({ totalSeats, feePerMonth, manager: req.user.id });
  
      res.status(201).json({ message: "Hub initialized successfully" ,success:true});
    } catch (error) {
      res.status(500).json({ message: "Server Error", error  , success:false});
    }
  };

// ✅ Get Hub Configuration (Seats Count & Fees)
const getHubConfig = async (req, res) => {
    try {
      const hubConfig = await HubConfig.findOne({ manager: req.user.id });
      if (!hubConfig) return res.status(404).json({ message: "Hub configuration not found" });
  
      const seats = await Seat.find({ manager: req.user.id });
      res.json({ hubConfig, seats });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

// ✅ Get All Seats (For Displaying in Dashboard)
const getAllSeats = async (req, res) => {
    try {
      const seats = await Seat.find({ manager: req.user.id }).populate("student");
      res.json(seats);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };
  

// ✅ Update Total Seats & Fees (Manager Only)
const updateHubConfig = async (req, res) => {
    try {
      const { totalSeats, feePerMonth } = req.body;
      const hubConfig = await HubConfig.findOne({ manager: req.user.id });
  
      if (!hubConfig) return res.status(404).json({ message: "Hub configuration not found" });
  
      const currentTotalSeats = hubConfig.totalSeats;
  
      if (totalSeats > currentTotalSeats) {
        // Add new seats
        let newSeats = [];
        for (let i = currentTotalSeats + 1; i <= totalSeats; i++) {
          let seatId = `S${String(i).padStart(3, "0")}`;
          newSeats.push({ seatId, feePerMonth, manager: req.user.id });
        }
        await Seat.insertMany(newSeats);
      } else if (totalSeats < currentTotalSeats) {
        // Remove extra empty seats
        const seatsToRemove = await Seat.find({ student: null, manager: req.user.id })
          .sort({ seatId: -1 })
          .limit(currentTotalSeats - totalSeats);
  
        if (seatsToRemove.length < currentTotalSeats - totalSeats) {
          return res.status(400).json({ message: "Cannot reduce seats as some are occupied" });
        }
  
        const seatIdsToRemove = seatsToRemove.map((seat) => seat._id);
        await Seat.deleteMany({ _id: { $in: seatIdsToRemove } });
      }
  
      // Update HubConfig with new totalSeats and feePerMonth
      hubConfig.totalSeats = totalSeats;
      hubConfig.feePerMonth = feePerMonth;
      await hubConfig.save();
  
      // Update all seat fees
      await Seat.updateMany({ manager: req.user.id }, { feePerMonth });
  
      res.json({ message: "Hub configuration updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

// ✅ Get Available Seats (Not Occupied)
const getAvailableSeats = async (req, res) => {
    try {
      const availableSeats = await Seat.find({ isOccupied: false, manager: req.user.id }).select("seatId");
      res.status(200).json(availableSeats);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };


module.exports = {
  initializeHub,
  getHubConfig,
  getAllSeats,
  updateHubConfig,
  getAvailableSeats
};

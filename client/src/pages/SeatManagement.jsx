import {  useEffect, useState } from "react";
import { useSeat } from "../contexts/seatContext"; 
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2";

export const SeatManagement = () => {
  const { seats, fetchSeats , getStudentById } = useSeat()
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeats(); // Load seats on component mount
  }, []);

  const handleSeatClick = async (seatId) => {
    const seat = seats.find((s) => s.seatId === seatId);
    if (seat?.isOccupied) {
      // Fetch Student Details
      try {
        console.log("debug-19")
        const response = await getStudentById(seatId)
        console.log(response)

        
        const student = response.student
        if (response.success) {
          Swal.fire({
            title: `Seat ${seatId} Details`,
            html: `
              <b>Name:</b> ${student.name} <br>
              <b>Gender:</b> ${student.gender} <br>
              <b>Mobile:</b> ${student.mobile} <br>
              <b>Address:</b> ${student.address}
            `,
            icon: "info",
            background: "#1a202c",
            color: "#fff",
            confirmButtonColor: "#3085d6",
            showCancelButton: true,  // This will show the cancel button
            confirmButtonText: "Close",
            cancelButtonText: "More Details",
            cancelButtonColor: "#38a169",  // You can choose a different color
          }).then((result) => {
            if (result.isDismissed) {
              // This will be triggered when "More Details" is clicked
              navigate(`/studentProfile/${seatId}`);
            }
          });
        } else {
          Swal.fire({
                      title: "Error",
                      text: "Student details not found",
                      icon: "error",
                      background: "#1a202c",
                      color: "#fff",
                      confirmButtonColor: "#d33",
                    })
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error,
          icon: "error",
          background: "#1a202c",
          color: "#fff",
          confirmButtonColor: "#d33",
        })      }
    } else {
      // Navigate to Add Student Form
      navigate(`/addStudent?seatNumber=${seatId}`);
    }
  };

  return (
    <>
    <div className="flex mx-5 my-5 items-center ">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-sm shadow-md hover:bg-blue-700 transition-all"
        >
          🔙 Go to Dashboard
        </button>
      </div>
    <div className="flex justify-center  min-h-screen">
      
  <div className="grid grid-cols-6 gap-3  max-w-md mx-auto">
    
    {seats
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => {
        // Extract numeric parts and compare
        const numA = parseInt(a.seatId.replace(/\D/g, ''));
        const numB = parseInt(b.seatId.replace(/\D/g, ''));
        return numA - numB;
      })
      .map((seat) => {
        // Extract last two digits
        const seatNumber = seat.seatId.match(/\d{2}$/)?.[0] || seat.seatId;
        return (
          <div
            key={seat.seatId}
            className={`w-12 h-12 flex items-center justify-center 
                        font-semibold text-gray-900 rounded-md cursor-pointer 
                        shadow-md border text-sm
                        ${seat.isOccupied ? "bg-green-400 border-green-400" : "bg-white border-green-400"}`}
            onClick={() => handleSeatClick(seat.seatId)}
          >
            {seatNumber}
          </div>
        );
      })}
  </div>
</div>
</>
);
};



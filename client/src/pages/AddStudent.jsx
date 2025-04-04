import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSeat } from "../contexts/seatContext"; 
import Swal from "sweetalert2";


export const AddStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addStudent } = useSeat()

  const seatNumber = new URLSearchParams(location.search).get("seatNumber");

  const [student, setStudent] = useState({
    name: "",
    gender: "",
    mobile: "",
    address: "",
    seatNumber,
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addStudent({
        name: student.name,
        gender: student.gender,
        mobile: student.mobile, 
        address: student.address, 
        seatId: student.seatNumber
    })
 
      if (response.success) {
        Swal.fire({
            title: "Admitted!",
            text: " Admission Successful",
            icon: "success",
            background: "#1a202c",
            color: "#fff",
            confirmButtonColor: "#3085d6",
          })
        navigate("/seats");
      } else {
        console.log(response)
        Swal.fire({
            title: "Admission Failed",
            text: "Failed to Add the Student",
            icon: "error",
            background: "#1a202c",
            color: "#fff",
            confirmButtonColor: "#d33",
          })
      }
    } catch (error) {
        Swal.fire({

            title: "Admission Failed",
            text: error,
            icon: "error",
            background: "#1a202c",
            color: "#fff",
            confirmButtonColor: "#d33",
          })
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white rounded-xl w-96 mx-auto mt-10 shadow-2xl border border-gray-700 transform transition-all hover:scale-[1.01]">
    <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
      Assign Seat <span className="text-white">#{seatNumber}</span>
    </h2>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" 
        name="name" 
        placeholder="Full Name" 
        required 
        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-400"
        onChange={handleChange} 
      />
      
      <select 
        name="gender" 
        required 
        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-gray-200 appearance-none"
        onChange={handleChange}
      >
        <option value=""  >Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      
      <div className="flex items-center">
  {/* Country code box */}
  <div className="p-3 rounded-l-lg bg-gray-700 border border-gray-700 text-gray-300">
    +91
  </div>
  
  {/* Phone number input */}
  <input
    type="tel"
    name="mobile"
    placeholder="Mobile Number"
    required
    pattern="[0-9]{10}"
    maxLength="10"
    className="p-3 rounded-r-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-400 flex-1"
    onChange={handleChange}
  />
</div>
      
      <textarea 
        name="address" 
        placeholder="Full Address" 
        rows="3" 
        required 
        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-400 resize-none"
        onChange={handleChange}
      ></textarea>
      
      <button 
        type="submit" 
        className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
      >
        Confirm & Submit
      </button>
    </form>
  </div>
  );
};



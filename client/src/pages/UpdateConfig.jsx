import { useState } from "react";
import { useSeat } from "../contexts/seatContext";
import Swal from "sweetalert2";

export const UpdateConfig = () => {
  const { updateConfig } = useSeat();
  const [totalSeats, setTotalSeats] = useState("");
  const [feePerMonth, setFeePerMonth] = useState("");

  const handleUpdateConfig = async () => {
    if (!totalSeats || !feePerMonth) {
      Swal.fire("Error", "Please enter all fields!", "error");
      return;
    }

    try {
      await updateConfig({ totalSeats: Number(totalSeats), feePerMonth: Number(feePerMonth) });

      Swal.fire({
        title: "Success!",
        text: "Configuration updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        background: "#1a202c",
        color: "#fff",
        confirmButtonColor: "#3085d6",
      });

      setTotalSeats("");
      setFeePerMonth("");
    } catch (error) {
      Swal.fire("Error", "Failed to update configuration.", "error");
      Swal.fire({
                  title: "Failed to Update",
                  text: error,
                  icon: "error",
                  background: "#1a202c",
                  color: "#fff",
                  confirmButtonColor: "#d33",
                })
    }
  };

  return (
    <>
    {/* Back Button */}
    <div className="mx-10 my-2">
    <button
    onClick={() => navigate("/dashboard")}
    className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
  >
    🔙 Back to Dashboard
  </button>
  </div>
    <div className="p-6 min-h-screen bg-gray-900 text-white flex flex-col items-center">
      
      <h2 className="text-3xl font-bold text-blue-400">⚙️ Update Configuration</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 w-96">
        <label className="block text-gray-300 text-lg font-medium">Total Seats</label>
        <input
          type="number"
          className="w-full p-2 no-arrows rounded-md bg-gray-700 text-white focus:outline-none mt-1"
          placeholder="Enter total seats"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
        />

        <label className="block text-gray-300 text-lg font-medium mt-4">Fee Per Month (₹)</label>
        <input
          type="number"
          className="w-full p-2 no-arrows rounded-md bg-gray-700 text-white focus:outline-none mt-1"
          placeholder="Enter fee per month"
          value={feePerMonth}
          onChange={(e) => setFeePerMonth(e.target.value)}
        />

        <button
          onClick={handleUpdateConfig}
          className="w-full bg-blue-600 cursor-pointer text-xl text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all mt-5"
        >
           Update 
        </button>
      </div>
    </div>
    </>
  );
};



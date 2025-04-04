import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSeat } from "../contexts/seatContext";
import Swal from "sweetalert2";

export const StudentProfile = () => {
  const { id } = useParams(); // Extract seatId from URL
  // console.log(id)
  const navigate = useNavigate();

  const { getStudentById, getStudentTransactions, removeStudent, submitFees } = useSeat();
  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    (async() => {  
      const studentData = await  getStudentById(id);
      setStudent(studentData);
      const transactionData = await  getStudentTransactions(id);
      setTransactions(transactionData.student.transactions);
    })()
  }, [id, getStudentById  ,getStudentTransactions]);

  if (!student) return <p className="text-gray-400 text-center mt-10">Loading student details...</p>;

  // ✅ Handle Fee Submission
  const handleSubmitFees = async () => {
    const { value: amount } = await Swal.fire({
      title: `Submit Fees for ${student.student.name}`,
      html: `
        <p class="text-lg font-semibold text-gray-400">Due Amount: <span class="text-red-400">₹${student.student.dueFees}</span></p>
<input 
  type="number" 
  id="feesAmount" 
  class="swal2-input no-arrows" 
  placeholder="Enter Amount"    inputmode="numeric"
  pattern="[0-9]*"
  min="1" 
  max="${student.student.dueFees}"
  style="width: 70%; -moz-appearance: textfield;"
/>      `,
      background: "#1a202c",
      color: "#fff",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: () => {
        const value = document.getElementById('feesAmount').value;
        if (!value || isNaN(value) || value <= 0) {
          Swal.showValidationMessage("Please enter a valid amount!");
          document.querySelector(".swal2-validation-message").style.backgroundColor = "#2d3748";
          document.querySelector(".swal2-validation-message").style.color = "#fff";
        }
        if (parseFloat(value) > parseFloat(student.student.dueFees)) {
          Swal.showValidationMessage("Cannot submit more than the due amount!");
          document.querySelector(".swal2-validation-message").style.backgroundColor = "#2d3748";
          document.querySelector(".swal2-validation-message").style.color = "#fff";        }
        return value;
      }
    });

    if (amount) {
      submitFees(id, parseInt(amount));
      Swal.fire({
                  title: "Success!",
                  text: `₹${amount} submitted successfully!`,
                  icon: "success",
                  background: "#1a202c",
                  color: "#fff",
                  confirmButtonColor: "#3085d6",
                })
      setStudent({...student, student: {...student.student, dueFees: student.student.dueFees - amount}});
      setTransactions([...transactions, { amount, date: new Date().toISOString() }]);
    }
  };

  // ✅ Handle Student Removal
  const handleRemoveStudent = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove ${student.student.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#d33",
      background: "#1a202c",
      color: "#fff",
      confirmButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      removeStudent(id);
      Swal.fire("Removed!", "Student has been removed.", "success");
      navigate("/students");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate("/students")}
        className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
      >
        🔙 Back to Students
      </button>

      {/* Student Details */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-5">
        <h2 className="text-2xl font-bold text-blue-400">{student.student.name}</h2>
        <p className="text-gray-400"> Gender: <span className="text-green-400">{student.student.gender}</span></p>
        <p className="text-gray-400"> Mobile: <span className="text-yellow-400">{student.student.mobile}</span></p>
        <p className="text-gray-400"> Address: <span className="text-purple-400">{student.student.address}</span></p>
        <p className="text-gray-400"> Seat Number: <span className="text-red-400">{student.student.seatNumber}</span></p>
        <p className="text-gray-400"> Due Fees: <span className="text-red-400 font-bold">₹{student.student.dueFees}</span></p>

        {/* Actions */}
        <div className="flex space-x-4 mt-4">
          <button onClick={handleSubmitFees} className="bg-green-600 cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-green-700">
            💵 Submit Fees
          </button>
          <button onClick={handleRemoveStudent} className="bg-red-600 cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-red-700">
            ❌ Remove Student
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-blue-400">💳 Transaction History</h3>
        {transactions.length > 0 ? (
          <div className="mt-4">
            {transactions.map((txn, index) => (
              <div key={index} className="flex justify-between border-b border-gray-700 py-2">
                <span className="text-gray-300">₹{txn.amount}</span>
                <span className="text-gray-500">{new Date(txn.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

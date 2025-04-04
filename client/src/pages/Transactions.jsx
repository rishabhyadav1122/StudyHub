import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSeat } from "../contexts/seatContext";

export const Transactions = () => {
  const navigate = useNavigate();
  const { students, fetchStudents } = useSeat();
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (students) {
      // Extract all transactions with student details
      let transactionsList = [];
      students.forEach((student) => {
        student.transactions.forEach((txn) => {
          transactionsList.push({
            ...txn,
            studentName: student.name,
            seatNumber: student.seatNumber,
          });
        });
      });

      // Sort transactions by date (latest first)
      transactionsList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllTransactions(transactionsList);
    }
  }, [students]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
      >
        🔙 Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-blue-400 mt-5">💳 All Transactions</h2>

      {/* Transactions List */}
      <div className="mt-5 bg-gray-800 p-6 rounded-lg shadow-lg">
        {allTransactions.length > 0 ? (
          <div className="space-y-4">
            {allTransactions.map((txn, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-md shadow-md"
              >
                <div>
                  <p className="text-lg font-semibold text-green-400">₹{txn.amount}</p>
                  <p className="text-white-400"> {txn.studentName} | 💺 {txn.seatNumber}</p>
                </div>
                <p className="text-grey-500">{new Date(txn.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No transactions available.</p>
        )}
      </div>
    </div>
  );
};


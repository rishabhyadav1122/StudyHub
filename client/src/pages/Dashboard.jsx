import { useEffect, useState } from "react";
import { useSeat } from "../contexts/seatContext";
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const {
    dashboardStats,
    fetchDashboardStats,
    transactions,
    fetchTransactions,
    students,
    fetchStudents,
    user
  } = useSeat();
  
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(user)
  const recentTransactions = dashboardStats.recentTransactions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchDashboardStats(), fetchTransactions(), fetchStudents()]);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user}</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold">Available Seats</h2>
          <p className="text-2xl font-bold">{dashboardStats?.availableSeats || 0}/{dashboardStats?.totalSeats || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-2xl font-bold">{students?.length || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold">Fees Collected this month</h2>
          <p className="text-2xl font-bold">₹{dashboardStats?.totalFeesCollected || 0}</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/seats')} className="bg-blue-600  cursor-pointer hover:bg-blue-700 px-4 py-2 rounded transition">
            Add Student
          </button>
          <button onClick={() => navigate('/students')} className="bg-green-600 cursor-pointer hover:bg-green-700 px-4 py-2 rounded transition">
            Submit Fees
          </button>
          <button onClick={() => navigate('/students')} className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 px-4 py-2 rounded transition">
            Get All Students
          </button>
          <button onClick={() => navigate('/seats')} className="bg-purple-600 cursor-pointer hover:bg-purple-700 px-4 py-2 rounded transition">
            All Seat
          </button>
        </div>
      </div>
      
      {/* Seat Grid (Live Availability) */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Seat Grid (Live Availability)</h2>
        <p className="text-sm text-gray-400">(Feature to be implemented)</p>
      </div>
      
      {/* Recent Transactions */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        {recentTransactions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 border border-gray-600">Student</th>
                  <th className="p-2 border border-gray-600">Seat</th>
                  <th className="p-2 border border-gray-600">Amount</th>
                  <th className="p-2 border border-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.slice(0, 10).map((transaction, index) => (
                  <tr key={index} className="border border-gray-600 hover:bg-gray-700">
                    <td className="p-2 text-center">{transaction.studentName}</td>
                    <td className="p-2 text-center">{transaction.studentSeat}</td>
                    <td className="p-2 text-center">₹{transaction.amount}</td>
                    <td className="p-2 text-center">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No transactions found</p>
        )}
      </div>
    </div>
  );
};
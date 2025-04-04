import { createContext, useContext, useState, useEffect } from "react";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  const [seats, setSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const token = localStorage.getItem("token");

  // Fetch all seats
  const fetchSeats = async () => {
    try {
      const response = await fetch("https://study-hub-omega.vercel.app/api/seats/getAllSeats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  const getAvailableSeats = async () => {
    try {
      const response = await fetch("https://study-hub-omega.vercel.app/api/seats/getAvailableSeats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAvailableSeats(data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await fetch("https://study-hub-omega.vercel.app/api/students/getAllStudents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fetch student by ID
  const getStudentById = async (id) => {
    try {
      const response = await fetch(`https://study-hub-omega.vercel.app/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Add a new student
  const addStudent = async (studentData) => {
    try {
      const response = await fetch("https://study-hub-omega.vercel.app/api/students/addStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });
      // const data = await response.json()
      // console.log(data)
      return await response.json();
    } catch (error) {
      console.error("Error adding student:", error);
      return error
    } 
  };

  // Remove a student and free seat
  const removeStudent = async (studentId) => {
    try {
      await fetch(`https://study-hub-omega.vercel.app/api/students/${studentId}/removeStudent`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
      // getStudentTransactions(studentId)
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  // Submit fees
  const submitFees = async (studentId, amount) => {
    try {
      await fetch(`https://study-hub-omega.vercel.app/api/students/${studentId}/submitFees`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
    } catch (error) {
      console.error("Error submitting fees:", error);
    }
  };

  const updateConfig = async (configData) => {
    try {
      await fetch("https://study-hub-omega.vercel.app/api/seats/updateConfig", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(configData),
      });
    } catch (error) {
      console.error("Error Updating Config:", error);
    }
  };


  const initializeConfig = async (totalSeats, feePerMonth) => {
    try {
      const auth_token = localStorage.getItem("token");

      console.log(totalSeats, feePerMonth)
      const response = await fetch("https://study-hub-omega.vercel.app/api/seats/initializeHub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({totalSeats, feePerMonth}),
      });
      return await response.json()
    } catch (error) {
      console.error("Error initialising Config:", error);
    }
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://study-hub-omega.vercel.app/api/students/getAllTransactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Get student's transactions
  const getStudentTransactions = async (studentId) => {
    try {
      const response = await fetch(`https://study-hub-omega.vercel.app/api/students/${studentId}/getStudentTransactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching student transactions:", error);
    }
  };



  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("https://study-hub-omega.vercel.app/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      setDashboardStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSeats();
      fetchStudents();
      fetchTransactions();
      fetchDashboardStats();
    }
  }, [token]);

  return (
    <SeatContext.Provider
      value={{
        seats,
        students,
        transactions,
        dashboardStats,
        fetchSeats,
        fetchStudents,
        getStudentById,
        addStudent,
        removeStudent,
        updateConfig,
        submitFees,
        fetchTransactions,
        getStudentTransactions,
        fetchDashboardStats,
        availableSeats,
        getAvailableSeats,
        initializeConfig
      }}
    >
      {children}
    </SeatContext.Provider>
  );
};


export const useSeat = () =>{
  const seatContextValue = useContext(SeatContext)
  if(!seatContextValue){
      throw new Error("useSeat used outside of the provider")

  }
  return seatContextValue
}

import { useEffect } from "react";
import { useSeat } from "../contexts/seatContext";
import { useNavigate } from "react-router-dom";

export const Students = () => {
  const { students, fetchStudents, getStudentById } = useSeat();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents(); // Fetch students on component mount
  }, []);

  const handleCardClick = (id) => {
    const student = getStudentById(id);
    if (student) {
      navigate(`/studentProfile/${id}`);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      {/* Dashboard Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-sm shadow-md hover:bg-blue-700 transition-all"
        >
          🔙 Go to Dashboard
        </button>
      </div>

      {/* Student Cards - Sorted by seatNumber */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {students.length > 0 ? (
          [...students]
            .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1))) // Sorting by seat number
            .map((student) => (
              <div
                key={student.seatNumber}
                className="bg-gray-800 p-4 shadow-md rounded-xl border border-gray-700 cursor-pointer 
                           hover:shadow-lg hover:border-blue-500 transition-all"
                onClick={() => handleCardClick(student.seatNumber)}
              >
                <h3 className="text-lg font-semibold text-blue-400">{student.name}</h3>
                <p className="text-gray-400"> Gender: <span className="text-green-400">{student.gender}</span></p>
                <p className="text-gray-400"> Mobile: <span className="text-yellow-400">{student.mobile}</span></p>
                <p className="text-gray-400"> Address: <span className="text-purple-400">{student.address}</span></p>
                <p className="text-gray-400"> Seat Number: <span className="text-red-400">{student.seatNumber}</span></p>
              </div>
            ))
        ) : (
          <p className="text-gray-400">No students found.</p>
        )}
      </div>
    </div>
  );
};



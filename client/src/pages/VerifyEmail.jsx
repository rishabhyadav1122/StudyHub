import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/authContext"; // Adjust the import path as needed
import { useSeat } from "../contexts/seatContext"; // Adjust the import path as needed

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const { verifyEmail , storeTokenInLS } = useAuth();
  const { initializeConfig } = useSeat();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) return; // Show normal "Check your Email" if token is not present.

    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        if (data.success) {
          storeTokenInLS(data.auth_token)
          setVerified(true);
          Swal.fire({
            title: "Email Verified Successfully 🎉",
            text: "Please provide some details about your Hub",
            icon: "success",
            background: "#1a202c",
            color: "#fff",
            confirmButtonColor: "#3085d6",
            showCancelButton: false,
            confirmButtonText: "Submit",
            html: `
              <input type="number" id="totalSeats" class="swal2-input" placeholder="Total Seats">
              <input type="number" id="feePerSeat" class="swal2-input" placeholder="Fee per Seat">
            `,
            preConfirm: () => {
              const totalSeats = document.getElementById("totalSeats").value;
              const feePerSeat = document.getElementById("feePerSeat").value;

              if (!totalSeats || !feePerSeat) {
                Swal.showValidationMessage("Both fields are required!");
                return false;
              }
              return { totalSeats, feePerSeat };
            }
          }).then(async (result) => {
            if (result.isConfirmed) {
              const { totalSeats, feePerSeat } = result.value;

              // Call initializeConfig function
              const res = await initializeConfig(totalSeats, feePerSeat);

              if (res.success) {
                Swal.fire("Success!", "Hub Initialized Successfully!", "success");
                navigate("/login"); // Redirect to login
              } else {
                Swal.fire("Error", res.message || "Failed to initialize the hub", "error");
              }
            }
          });
        } else {
          Swal.fire({
            title: "Verification Failed-35",
            text: data.message+"-36" || "Failed to verify your email",
            icon: "error",
            background: "#1a202c",
            color: "#fff",
            confirmButtonColor: "#d33",
          }).then(() => {
            navigate("/register");
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error,
          icon: "error",
          background: "#1a202c",
          color: "#fff",
          confirmButtonColor: "#d33",
        }).then(() => {
          navigate("/register");
        });
      }
    };

    verify();
  }, [navigate, verifyEmail, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-white text-3xl font-bold mb-4">
          {verified ? "Email Verified!" : "Thanks for Registering!"}
        </h2>
        <p className="text-gray-400">
          {verified
            ? "You can now log in."
            : `A verification email has been sent to ${email}. Please check your inbox.`}
        </p>
      </div>
    </div>
  );
};

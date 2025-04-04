import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {Layout} from "./components/Layout";
// import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Dashboard } from "./pages/Dashboard";
import { SeatManagement } from "./pages/SeatManagement";
import { Transactions } from "./pages/Transactions";
import { Students } from "./pages/Students";
import { Profile } from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Logout } from "./pages/Logout";
import { Error } from "./pages/Error";
import { AddStudent } from "./pages/AddStudent";
import { StudentProfile } from "./pages/StudentProfile";
import { UpdateConfig } from "./pages/UpdateConfig";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token");
  if (!isLoggedIn) {
    // toast.error("Please login or register first.");
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { duration: 0.4 },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {[
          // { path: "/", element: <Home /> },
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/verifyEmail", element: <VerifyEmail /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password/:token", element: <ResetPassword /> },
          { path: "/", element: <Dashboard />, private: true },
          { path: "/addStudent", element: <AddStudent />, private: true },
          { path: "/seats", element: <SeatManagement />, private: true },
          { path: "/transactions", element: <Transactions />, private: true },
          { path: "/updateConfig", element: <UpdateConfig />, private: true },
          { path: "/students", element: <Students />, private: true },
          { path: "/studentProfile/:id", element: <StudentProfile />, private: true },
          { path: "/profile", element: <Profile />, private: true },
          { path: "/logout", element: <Logout />, private: true },
          { path: "*", element: <Error /> },
        ].map(({ path, element, private: isPrivate }) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div {...pageTransition}>
                {isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element}
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  );
};

export default App;


import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Calendar from "./pages/Calendar";
import Events from "./pages/Events";
import LeaveApplicationForm from "./pages/LeaveApplicationform";
import LeaveApprovals from "./pages/LeaveApprovals";
import LeaveHistory from "./pages/LeaveHistory";
import LeaveSettings from "./pages/LeaveSettings";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import LeaveTable from "./pages/LeaveTable";
import CompensatoryLeaveForm from "./pages/CompensatoryLeaveForm";
import EarnedLeaveForm from "./pages/EarnedLeaveForm";
import EarnedLeaveApprovals from "./pages/EarnedLeaveApproval";
import AdminEarnedLeaveApprovals from "./pages/AdminEarnedLeaveApprovals";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  console.log({ onlineUsers });
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  console.log({ authUser, userId });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/calendar"
          element={authUser ? <Calendar /> : <Navigate to="/login" />}
        />

        <Route
          path="/Dashboard"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/earnedleaveapproval"
          element={
            authUser ? <EarnedLeaveApprovals /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/earnedleaveapprovaladmin"
          element={
            authUser ? <AdminEarnedLeaveApprovals /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/events"
          element={authUser ? <Events /> : <Navigate to="/login" />}
        />

        <Route
          path="/earnedleave"
          element={authUser ? <EarnedLeaveForm /> : <Navigate to="/login" />}
        />

        <Route
          path="/leaveapplication"
          element={
            authUser ? (
              <LeaveApplicationForm userId={userId} fullName={fullName} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/history"
          element={authUser ? <LeaveHistory /> : <Navigate to="/login" />}
        />

        <Route
          path="/apply-ccl"
          element={
            authUser ? <CompensatoryLeaveForm /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/leavesettings"
          element={authUser ? <LeaveSettings /> : <Navigate to="/login" />}
        />
        <Route
          path="/LeaveTable"
          element={authUser ? <LeaveTable /> : <Navigate to="/login" />}
        />
        <Route
          path="/approvals"
          element={
            authUser ? (
              <LeaveApprovals userId={userId} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;

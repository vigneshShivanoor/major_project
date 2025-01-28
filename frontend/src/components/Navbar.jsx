import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Gcetian</h1>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 relative">
            {/* Leaves Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  showDropdown ? "bg-gray-700" : "hover:bg-gray-700/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Leaves
                </span>
                {showDropdown ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              {/* Dropdown Items */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800 text-gray-300 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => navigate("/leaveapplication")}
                    className="w-full p-3 text-left hover:bg-gray-700 rounded-t-lg text-sm"
                  >
                    Apply for Leave
                  </button>
                  <button
                    onClick={() => navigate("/approvals")}
                    className="w-full p-3 text-left hover:bg-gray-700 text-sm"
                  >
                    Pending Approvals
                  </button>
                  <button
                    onClick={() => navigate("/history")}
                    className="w-full p-3 text-left hover:bg-gray-700 text-sm"
                  >
                    Leave History
                  </button>
                  <button
                    onClick={() => navigate("/leavesettings")}
                    className="w-full p-3 text-left hover:bg-gray-700 rounded-b-lg text-sm"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>

            {/* Other Links */}
            {authUser && (
              <>
                <Link to={"/settings"} className={`btn btn-sm gap-2`}>
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <Link to={"/calendar"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Calendar</span>
                </Link>
                <Link to={"/events"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Events</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

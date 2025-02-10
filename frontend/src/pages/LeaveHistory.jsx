import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function LeaveHistory() {
  const { authUser } = useAuthStore();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (authUser?._id) {
      axios
        .get(`http://localhost:5000/api/leaves/${authUser._id}`)
        .then((res) => {
          console.log("🟢 User Leave History:", res.data);
          setLeaves(res.data);
        })
        .catch((error) => console.error("🚨 Error Fetching Leaves:", error));
    } else {
      console.error("🚨 No User ID found!");
    }
  }, [authUser]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-r from--900 to-indigo-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-3xl shadow-6xl p-8 border border-gray-700">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Leave History
          </h2>

          {leaves.length === 0 ? (
            <p className="text-gray-400 text-center">
              No leave applications found.
            </p>
          ) : (
            <ul className="space-y-6">
              {leaves.map((leave) => (
                <li
                  key={leave._id}
                  className={`p-6 rounded-xl transition-all duration-300 ease-in-out transform ${
                    leave.status === "accepted" ? "bg-green-700" : "bg-red-700"
                  } border-2 ${
                    leave.status === "accepted"
                      ? "border-green-500"
                      : "border-red-500"
                  } hover:scale-105`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-bold">{leave.status}</p>
                      <p className="text-md text-gray-300">{leave.leaveType}</p>
                    </div>
                    <div>
                      {leave.status === "accepted" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v3a1 1 0 11-2 0V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v3a1 1 0 11-2 0V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <strong>Start Date:</strong>{" "}
                      {new Date(leave.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong>End Date:</strong>{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                    {leave.remarks && (
                      <p className="text-sm">
                        <strong>Remarks:</strong> {leave.remarks}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

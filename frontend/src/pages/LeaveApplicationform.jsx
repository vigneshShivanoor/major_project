import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function LeaveApplicationForm() {
  const { authUser } = useAuthStore();
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    primaryApproverRole: "",
    adminApprover: "6795dd028da3d527929978f1",
  });

  useEffect(() => {
    if (authUser) {
      setUserId(authUser._id);
      setFullName(authUser.fullName);
    }
  }, [authUser]);

  const roles = [
    "HOD-CSE",
    "HOD-CSE-AIML",
    "HOD-ECE",
    "HOD-IT",
    "HOD-EEE",
    "HOD-CIVIL",
    "HOD-MECH",
    "HOD-FRESHERMAN",
    "Principal",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser?._id) {
      console.error("Error: authUser._id is missing. Check authentication.");
      return;
    }

    const leaveRequest = {
      userId: authUser._id,
      fullName: authUser.fullName,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      primaryApprover: formData.primaryApproverRole,
      adminApprover: "6795dd028da3d527929978f1",
    };

    try {
      const response = await fetch("http://localhost:5000/api/leaves/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveRequest),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage("Failed to apply for leave.");
        setMessageType("error");
      } else {
        setMessage("Leave application submitted successfully.");
        setMessageType("success");
        setFormData({
          leaveType: "",
          startDate: "",
          endDate: "",
          reason: "",
          primaryApproverRole: "",
          adminApprover: "6795dd028da3d527929978f1",
        });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Network error submitting leave application:", error);
      setMessage("Network error. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">Leave Application</h2>
          {message && (
            <div
              className={`text-center py-2 px-4 mb-4 rounded-lg text-white ${
                messageType === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Special Leave">Special Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Compensatory Casual Leave">
                  Compensatory Casual Leave
                </option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Primary Approver Role
              </label>
              <select
                name="primaryApproverRole"
                value={formData.primaryApproverRole}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function LeaveApplicationForm() {
  const { authUser } = useAuthStore(); // Get logged-in user
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
  });

  // Set userId when authUser is available
  useEffect(() => {
    if (authUser) {
      setUserId(authUser._id); // Assuming the ID is stored as `_id`
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const data = new FormData();
    data.append("userId", userId);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("leaveType", formData.leaveType);
    data.append("reason", formData.reason);
    if (formData.document) {
      data.append("document", formData.document);
    }
    console.log("🟢 Submitting form data:", {
      userId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      leaveType: formData.leaveType,
      reason: formData.reason,
      document: formData.document ? formData.document.name : "No document",
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leaves/apply",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("✅ Response:", res.data);

      alert("Leave application submitted successfully!");
    } catch (error) {
      console.error("🚨 Error:", error.response?.data || error.message);
      alert(
        "Failed to apply for leave. " + (error.response?.data?.message || "")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg">
      <label className="block text-white">Leave Type:</label>
      <select
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
        className="w-full p-2"
      >
        <option value="">Select Leave Type</option>
        <option value="Sick Leave">Sick Leave</option>
        <option value="Casual Leave">Casual Leave</option>
        <option value="Earned Leave">Earned Leave</option>
      </select>

      <label className="block text-white mt-4">Start Date:</label>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="w-full p-2"
      />

      <label className="block text-white mt-4">End Date:</label>
      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        className="w-full p-2"
      />

      <label className="block text-white mt-4">Reason:</label>
      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        className="w-full p-2"
      ></textarea>

      <label className="block text-white mt-4">Upload Document:</label>
      <input type="file" onChange={handleFileChange} className="w-full p-2" />

      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}

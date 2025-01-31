import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function LeaveApplicationForm() {
  const { authUser } = useAuthStore();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
    documentName: "",
    approver: "",
  });

  useEffect(() => {
    if (authUser) {
      setUserId(authUser._id);
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      document: file,
      documentName: file ? file.name : "",
    });
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
    data.append("approver", formData.approver);
    if (formData.document) {
      data.append("document", formData.document);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leaves/apply",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Leave application submitted successfully!");
    } catch (error) {
      alert(
        "Failed to apply for leave. " + (error.response?.data?.message || "")
      );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">Leave Application</h2>

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
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
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
                Supporting Document
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block w-full text-center px-4 py-2 bg-gray-700 rounded-lg cursor-pointer"
              >
                Upload File
              </label>
              {formData.documentName && (
                <p className="mt-2 text-sm">
                  Uploaded File: {formData.documentName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Approver
              </label>
              <select
                name="approver"
                value={formData.approver}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                required
              >
                <option value="">Select Approver</option>
                <option value="HOD">HOD</option>
                <option value="Dean">Dean</option>
                <option value="Admin">Admin</option>
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

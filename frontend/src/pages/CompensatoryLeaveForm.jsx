import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function CompensatoryLeaveForm() {
  const { authUser } = useAuthStore();
  const [dateWorked, setDateWorked] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/leaves/ccl", {
        userId: authUser._id,
        dateWorked,
        reason,
      });
      setMessage(res.data.message || "Leave request submitted successfully");
    } catch (error) {
      setMessage("Error submitting leave request");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">
            Apply for Compensatory Leave
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Date Worked</label>
              <input
                type="date"
                value={dateWorked}
                onChange={(e) => setDateWorked(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-lg">{message}</p>}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore"; // Ensure this is correctly imported

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

const EarnedLeaveForm = () => {
  const { authUser } = useAuthStore(); // Fetch authenticated user
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    primaryApprover: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure authUser is available
    if (!authUser?._id || !authUser?.fullName) {
      alert("User information is missing. Please log in again.");
      return;
    }

    try {
      console.log("Submitting Earned Leave:", {
        userId: authUser._id,
        fullName: authUser.fullName,
        ...formData,
      });

      await axios.post("http://localhost:5000/api/earned-leave/apply", {
        userId: authUser._id,
        fullName: authUser.fullName,
        ...formData,
      });

      alert("Earned Leave request submitted successfully!");
    } catch (error) {
      console.error("Error applying for Earned Leave:", error);
      alert("Failed to apply for Earned Leave.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
        Apply for Earned Leave
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600">Start Date:</label>
          <input
            type="date"
            name="startDate"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-600">End Date:</label>
          <input
            type="date"
            name="endDate"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-600">Primary Approver (HOD):</label>
          <select
            name="primaryApprover"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="">Select HOD</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600">Reason:</label>
          <textarea
            name="reason"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default EarnedLeaveForm;

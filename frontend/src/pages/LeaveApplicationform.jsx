import React, { useState } from "react";
import { Calendar, FileText, Users, AlertCircle } from "lucide-react";
import axios from "axios";

export default function LeaveApplicationForm({ onClose }) {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    documents: [],
    approver: "",
    isHalfDay: false,
  });

  const leaveTypes = [
    {
      id: "casual",
      name: "Casual Leave (CL)",
      maxDays: 15,
      rules: [
        "Maximum 6 days per spell",
        "Cannot be combined with other leaves",
        "Half-day leave allowed",
      ],
    },
    {
      id: "earned",
      name: "Earned Leave (EL)",
      maxDays: 15,
      rules: [
        "Minimum 5 days per application",
        "Maximum 3 occasions per year",
        "Can be carried forward",
      ],
    },
    {
      id: "sick",
      name: "Sick Leave",
      maxDays: 10,
      rules: [
        "Medical certificate required for 3+ days",
        "Can be applied retrospectively",
      ],
    },
    {
      id: "maternity",
      name: "Maternity Leave",
      maxDays: 84,
      rules: [
        "6 weeks full pay + 6 weeks half pay",
        "Medical certificate required",
        "Only once during service",
      ],
    },
    {
      id: "study",
      name: "Study Leave",
      rules: [
        "Subject to management approval",
        "Requires course details",
        "Bond agreement may be required",
      ],
    },
  ];

  const approvers = [
    { id: "hod", name: "Head of Department" },
    { id: "dean", name: "Dean" },
    { id: "principal", name: "Principal" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to send to backend
    const formDataToSend = new FormData();
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("leaveType", formData.leaveType);
    formDataToSend.append("reason", formData.reason);
    formDataToSend.append("approver", "6795dd028da3d527929978f1");
    formDataToSend.append("primaryApprover", "6795dceb8da3d527929978e8"); // Fixed primary approver ID

    // Add files if they exist
    if (formData.documents.length > 0) {
      formData.documents.forEach((doc) =>
        formDataToSend.append("documents", doc)
      );
    }

    try {
      // Send the form data to the backend API
      const response = await axios.post(
        "http://localhost:5000/api/leaves/apply",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Use the JWT token from localStorage
          },
        }
      );

      // Handle successful response
      console.log(response.data);
      alert("Leave application submitted successfully!");
      onClose();
    } catch (error) {
      // Handle error response
      console.error("Error applying leave:", error);
      alert("There was an error submitting your leave application.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <h2 className="text-2xl font-bold text-white mb-6">Leave Application</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type Selection */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Leave Type
          </label>
          <select
            value={formData.leaveType}
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Show rules for selected leave type */}
          {formData.leaveType && (
            <div className="mt-4 bg-gray-700 p-4 rounded-lg">
              <div className="flex items-start gap-2 text-yellow-400">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">Important Rules</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {leaveTypes
                      .find((t) => t.id === formData.leaveType)
                      ?.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reason and Documents */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for Leave
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Please provide detailed reason for your leave request..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Supporting Documents
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({ ...formData, documents: files });
              }}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-gray-700 file:text-white
                hover:file:bg-gray-600"
            />
          </div>
        </div>

        {/* Approver Selection */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Approver
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <select
              value={formData.approver}
              onChange={(e) =>
                setFormData({ ...formData, approver: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Approver</option>
              {approvers.map((approver) => (
                <option key={approver.id} value={approver.id}>
                  {approver.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import {
  Check,
  X,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  Building,
} from "lucide-react";

export default function LeaveApprovals() {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const pendingApprovals = [
    {
      id: 1,
      employee: "John Doe",
      email: "john.doe@gcet.edu.in",
      department: "CSE",
      type: "Casual Leave",
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      reason: "Family function",
      status: "pending",
      leavesTaken: 12,
      maxLeaves: 15,
    },
    {
      id: 2,
      employee: "Jane Smith",
      email: "jane.smith@gcet.edu.in",
      department: "ECE",
      type: "Sick Leave",
      startDate: "2024-03-25",
      endDate: "2024-03-26",
      reason: "Medical appointment",
      status: "pending",
      leavesTaken: 8,
      maxLeaves: 15,
    },
  ];

  const calculateLeaveDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAction = (leave, action) => {
    console.log(`Leave ${action}ed for ${leave.employee}`);
    setShowModal(false);
    setSelectedLeave(null);
  };

  const openLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto pt-16">
      <h2 className="text-2xl font-bold text-white mb-6">Pending Approvals</h2>

      <div className="space-y-4">
        {pendingApprovals.map((leave) => (
          <div key={leave.id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-white">
                    {leave.employee}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(leave.startDate).toLocaleDateString()} -{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {leave.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {leave.department}
                  </span>
                </div>
              </div>
              <button
                onClick={() => openLeaveDetails(leave)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
        {pendingApprovals.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No pending approvals
          </div>
        )}
      </div>

      {showModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">
                Leave Request Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Employee</p>
                  <p className="text-white">{selectedLeave.employee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="text-white">{selectedLeave.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedLeave.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Leave Type</p>
                  <p className="text-white">{selectedLeave.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Duration</p>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="text-white">
                        {new Date(selectedLeave.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">End Date</p>
                      <p className="text-white">
                        {new Date(selectedLeave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Days</p>
                      <p className="text-white">
                        {calculateLeaveDays(
                          selectedLeave.startDate,
                          selectedLeave.endDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Leave Balance</p>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Leaves Taken</p>
                      <p className="text-white">
                        {selectedLeave.leavesTaken} / {selectedLeave.maxLeaves}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Remaining</p>
                      <p className="text-white">
                        {selectedLeave.maxLeaves - selectedLeave.leavesTaken}
                      </p>
                    </div>
                  </div>
                  {selectedLeave.leavesTaken >= selectedLeave.maxLeaves && (
                    <div className="mt-4 flex items-center gap-2 text-yellow-500">
                      <AlertTriangle className="w-5 h-5" />
                      <p className="text-sm">Leave balance exceeded</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Reason for Leave</p>
                <p className="text-white bg-gray-700 p-4 rounded-lg">
                  {selectedLeave.reason}
                </p>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => handleAction(selectedLeave, "reject")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleAction(selectedLeave, "approve")}
                  className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${
                    selectedLeave.leavesTaken >= selectedLeave.maxLeaves
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={
                    selectedLeave.leavesTaken >= selectedLeave.maxLeaves
                  }
                >
                  <Check className="w-5 h-5" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

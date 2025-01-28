import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function LeaveHistory() {
  const leaveHistory = [
    {
      id: 1,
      type: "Casual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-16",
      status: "approved",
      reason: "Personal work",
      approvedBy: "Dr. Smith",
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      status: "rejected",
      reason: "Medical emergency",
      approvedBy: "Dr. Johnson",
      remarks: "Insufficient documentation",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-16">
      <h2 className="text-2xl font-bold text-white mb-6">Leave History</h2>

      <div className="space-y-4">
        {leaveHistory.map(function (leave) {
          return (
            <div key={leave.id} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center gap-2 font-medium ${getStatusClass(
                        leave.status
                      )}`}
                    >
                      {getStatusIcon(leave.status)}
                      {leave.status.charAt(0).toUpperCase() +
                        leave.status.slice(1)}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-300">{leave.type}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {leave.approvedBy}
                    </span>
                  </div>

                  <p className="text-gray-300">{leave.reason}</p>

                  {leave.remarks && (
                    <p className="text-sm text-red-400 mt-2">
                      Remarks: {leave.remarks}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

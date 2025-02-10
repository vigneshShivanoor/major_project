import React from "react";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { User } from "../types/user";
import { LeaveApplication } from "../types/leave";

const mockUser: User = {
  id: "1",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@gcet.edu",
  role: "faculty",
  department: "Computer Science",
  designation: "Associate Professor",
  leaveBalance: {
    CL: 12,
    HDL: 6,
    CCL: 3,
    EL: 15,
  },
};

const mockLeaves: LeaveApplication[] = [
  {
    id: "1",
    facultyId: "1",
    facultyName: "Dr. Sarah Johnson",
    department: "Computer Science",
    type: "CL",
    startDate: new Date("2024-03-20"),
    endDate: new Date("2024-03-22"),
    reason: "Family function",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Dashboard() {
  const renderLeaveBalance = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Object.entries(mockUser.leaveBalance).map(([type, balance]) => (
        <div key={type} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
          <p className="text-3xl font-bold text-blue-500">{balance}</p>
          <p className="text-sm text-gray-600">days remaining</p>
        </div>
      ))}
    </div>
  );

  const renderHODApprovals = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Pending Approvals
      </h3>
      <div className="space-y-4">
        {mockLeaves.map((leave) => (
          <div key={leave.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{leave.facultyName}</p>
                <p className="text-sm text-gray-600">
                  {leave.type} - {leave.reason}
                </p>
                <p className="text-sm text-gray-500">
                  {leave.startDate.toLocaleDateString()} -{" "}
                  {leave.endDate.toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-green-500 hover:text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdminOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Leave Requests
          </h3>
          <p className="text-3xl font-bold text-blue-500">24</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Pending Approvals
          </h3>
          <p className="text-3xl font-bold text-yellow-500">8</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Approved Today
          </h3>
          <p className="text-3xl font-bold text-green-500">5</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Department Overview
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Computer Science</span>
            <span className="text-blue-500">12 active requests</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Electronics</span>
            <span className="text-blue-500">8 active requests</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Mechanical</span>
            <span className="text-blue-500">4 active requests</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, {mockUser.name}
        </h2>
        <p className="text-gray-600">
          {mockUser.department} - {mockUser.designation}
        </p>
      </div>

      {mockUser.role === "faculty" && renderLeaveBalance()}
      {mockUser.role === "hod" && renderHODApprovals()}
      {mockUser.role === "admin" && renderAdminOverview()}
    </div>
  );
}

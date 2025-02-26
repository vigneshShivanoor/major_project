import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import "./LeaveApprovals.css"; // Import the CSS file

const LeaveApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser?._id) {
      axios
        .get(`http://localhost:5000/api/leaves/pending/${authUser._id}`)
        .then((res) => {
          console.log("API Response:", res.data);
          if (res.data && Array.isArray(res.data.pendingLeaves)) {
            setPendingApprovals(res.data.pendingLeaves); // Extract the array
          } else {
            console.error("Unexpected API response format:", res.data);
            setPendingApprovals([]); // Prevents .map() crash
          }
        })
        .catch((err) => console.error("Error fetching approvals:", err));
    }
  }, [authUser]);

  const handleStatusUpdate = async (leaveId, status) => {
    console.log("Updating Leave ID:", leaveId, "Status:", status);
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/leaves/update-status/${leaveId}`, // 🔹 Add leaveId in the URL
        { status } // Send only status in the body
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Function to trim date to "YYYY-MM-DD" format
  const formatDate = (dateString) => dateString.split("T")[0];

  return (
    <div className="leave-approvals-container">
      <h2>Pending Leave Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <div className="table-responsive">
          <table className="leave-approvals-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Leave Balances</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.fullName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.status}</td>
                  <td>
                    <div className="leave-balances">
                      <strong>CL:</strong>{" "}
                      {leave.leaveBalances?.casualLeaves || 0} |
                      <strong> EL:</strong>{" "}
                      {leave.leaveBalances?.earnedLeaves || 0} |
                      <strong> HPL:</strong>{" "}
                      {leave.leaveBalances?.halfPayLeaves || 0} |
                      <strong> SL:</strong>{" "}
                      {leave.leaveBalances?.specialLeaves || 0}
                    </div>
                  </td>
                  <td>
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave._id, "accepted")
                          }
                          className="btn-accept"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave._id, "rejected")
                          }
                          className="btn-reject"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>{leave.status.toUpperCase()}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;

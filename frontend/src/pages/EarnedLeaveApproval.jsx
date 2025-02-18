import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import "./LeaveApprovals.css"; // Reusing same styles

const EarnedLeaveApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser?._id) {
      axios
        .get(`http://localhost:5000/api/earned-leave/pending/${authUser._id}`)
        .then((res) => {
          console.log("API Response:", res.data);
          if (res.data && Array.isArray(res.data.pendingEarnedLeaves)) {
            setPendingApprovals(res.data.pendingEarnedLeaves);
          } else {
            console.error("Unexpected API response format:", res.data);
            setPendingApprovals([]);
          }
        })
        .catch((err) => console.error("Error fetching approvals:", err));
    }
  }, [authUser]);

  const handleStatusUpdate = async (leaveId, status) => {
    console.log("Updating Earned Leave ID:", leaveId, "Status:", status);
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/earned-leave/update-status/${leaveId}`,
        { status }
      );
      console.log("Response:", response.data);
      // Refresh list after update
      setPendingApprovals((prev) =>
        prev.filter((leave) => leave._id !== leaveId)
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Function to format date
  const formatDate = (dateString) => dateString.split("T")[0];

  return (
    <div className="leave-approvals-container">
      <h2>Pending Earned Leave Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <div className="table-responsive">
          <table className="leave-approvals-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.fullName}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.status}</td>
                  <td>{leave.reason}</td>
                  <td>
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave._id, "HOD Approved")
                          }
                          className="btn-accept"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave._id, "Rejected")
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

export default EarnedLeaveApprovals;

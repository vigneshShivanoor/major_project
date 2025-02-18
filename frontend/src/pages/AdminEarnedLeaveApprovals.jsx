import { useEffect, useState } from "react";
import axios from "axios";
import "./LeaveApprovals.css";

const AdminEarnedLeaveApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/earned-leave/pending-admin")
      .then((res) => {
        console.log("API Response:", res.data);
        setPendingApprovals(res.data.pendingEarnedLeaves || []);
      })
      .catch((err) => console.error("Error fetching approvals:", err));
  }, []);

  const handleStatusUpdate = async (leaveId, status) => {
    console.log("Updating Earned Leave ID:", leaveId, "Status:", status);
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/earned-leave/update-status/${leaveId}`,
        { status }
      );
      console.log("Response:", response.data);
      setPendingApprovals((prev) =>
        prev.filter((leave) => leave._id !== leaveId)
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString) => dateString.split("T")[0];

  return (
    <div className="leave-approvals-container">
      <h2>Pending Earned Leave Approvals (Admin)</h2>
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
                    <button
                      onClick={() =>
                        handleStatusUpdate(leave._id, "Admin Approved")
                      }
                      className="btn-accept"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(leave._id, "Rejected")}
                      className="btn-reject"
                    >
                      Reject
                    </button>
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

export default AdminEarnedLeaveApprovals;

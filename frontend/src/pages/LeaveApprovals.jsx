import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import "./LeaveApprovals.css"; // Import the CSS file

const LeaveApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    console.log("authUser:", authUser);
    if (authUser?._id) {
      console.log("Fetching leaves for primaryApprover:", authUser._id);

      axios
        .get(`http://localhost:5000/api/leaves/pending/${authUser._id}`)
        .then((res) => {
          console.log("Fetched leaves:", res.data); // Log all fetched leaves
          setPendingApprovals(res.data);
        })
        .catch((err) => console.error("Error fetching approvals:", err));
    }
  }, [authUser]);

  const handleStatusUpdate = (leaveId, status) => {
    console.log(`Updating leave status: ${leaveId} → ${status}`);

    axios
      .patch(`http://localhost:5000/api/leaves/update-status/${leaveId}`, {
        status,
      })
      .then((res) => {
        console.log("Updated leave:", res.data); // Log the updated leave
        setPendingApprovals((prev) =>
          prev.map((leave) =>
            leave._id === leaveId ? { ...leave, status } : leave
          )
        );
      })
      .catch((err) => console.error("Error updating status:", err));
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

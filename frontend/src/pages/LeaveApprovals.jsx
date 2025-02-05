import { useEffect, useState } from "react";
import axios from "axios";

const LeaveApprovals = ({ authUser }) => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
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

  return (
    <div>
      <h2>Pending Leave Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <table border="1" cellPadding="5" style={{ width: "100%" }}>
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
                <td>{leave.employeeName}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(leave._id, "accepted")
                        }
                        style={{
                          marginRight: "10px",
                          background: "green",
                          color: "white",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(leave._id, "rejected")
                        }
                        style={{ background: "red", color: "white" }}
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
      )}
    </div>
  );
};

export default LeaveApprovals;

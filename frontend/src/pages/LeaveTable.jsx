import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Table } from "../components/ui/Table";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv

const LeaveTable = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Fetch leave data from API
    const fetchLeaves = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leaves"); // Adjust API endpoint
        const data = await response.json();
        setLeaves(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    fetchLeaves();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaves);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");
    XLSX.writeFile(workbook, "leave_data.xlsx");
  };

  // Function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(); // Format as MM/DD/YYYY or YYYY-MM-DD depending on locale
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leave Applications</h2>
        <Button onClick={exportToExcel} className="bg-blue-500 text-white">
          Download Excel
        </Button>
      </div>
      <Table>
        <thead>
          <tr className="bg-gray-200">
            <th>Employee Name</th>
            <th>Primary Approver</th>
            <th>Type of Leave</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave, index) => (
            <tr key={index} className="border-b">
              <td>{leave.fullName}</td>
              <td>{leave.primaryApproverName}</td>
              <td>{leave.leaveType}</td>
              <td>{formatDate(leave.startDate)}</td>{" "}
              {/* Formatted start date */}
              <td>{formatDate(leave.endDate)}</td> {/* Formatted end date */}
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Button to download CSV */}
      <div className="fixed bottom-4 right-4">
        <CSVLink
          data={leaves} // The data to be downloaded as CSV
          filename={"leave_data.csv"} // The name of the CSV file
          className="bg-green-500 text-white p-2 rounded"
        >
          Download CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default LeaveTable;

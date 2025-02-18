import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function Dashboard() {
  const { authUser } = useAuthStore();
  const [leaveCounters, setLeaveCounters] = useState(null);

  useEffect(() => {
    if (authUser?._id) {
      axios
        .get(`http://localhost:5000/api/leaves/counters/${authUser._id}`)
        .then((res) => setLeaveCounters(res.data))
        .catch((err) => console.error("Error fetching leave counters:", err));
    }
  }, [authUser]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
          {leaveCounters ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(leaveCounters).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-700 p-4 rounded-lg text-center"
                >
                  <p className="text-lg font-semibold">{key}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading leave counters...</p>
          )}
        </div>
      </div>
    </div>
  );
}

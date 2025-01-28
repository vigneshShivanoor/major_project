import React, { useEffect, useState } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || {};
    const eventList = Object.entries(savedEvents).map(([date, title]) => ({
      date,
      title,
    }));
    setEvents(eventList);
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">All Events</h1>

        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <p className="text-lg font-semibold">{event.title}</p>
                <p className="text-sm text-gray-400">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No events scheduled yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;

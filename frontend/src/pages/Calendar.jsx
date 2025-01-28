import React, { useState, useEffect } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");
  const [events, setEvents] = useState({}); // Store events keyed by date (e.g., "2024-01-01": "Event Title")

  // Load saved events from localStorage
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || {};
    setEvents(savedEvents);
  }, []);

  // Save events to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = new Date(year, month, 1).getDay();
  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}`
      );
    }
  };

  const handleSaveEvent = () => {
    if (selectedDate && title.trim()) {
      setEvents((prev) => ({ ...prev, [selectedDate]: title }));
      setSelectedDate(null);
      setTitle("");
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        {/* Added margin to create space above the calendar */}
        <div className="flex flex-col items-center mb-8 mt-16">
          <div className="flex justify-between items-center w-full max-w-md mb-4">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Prev
            </button>
            <h2 className="text-xl font-bold">
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold text-gray-400">
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                day
                  ? events[
                      `${year}-${String(month + 1).padStart(2, "0")}-${String(
                        day
                      ).padStart(2, "0")}`
                    ]
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-gray-800 hover:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Add Event</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedDate(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

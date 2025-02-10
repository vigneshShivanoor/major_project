import React from "react";

export const Table = ({ children }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      {children}
    </table>
  );
};

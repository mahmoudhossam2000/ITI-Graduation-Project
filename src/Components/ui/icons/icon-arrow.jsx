import React from "react";

function IconArrow({ sortConfig, columnKey }) {
  if (!sortConfig || sortConfig.key !== columnKey) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400 inline ml-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 3l-3 3h6l-3-3zM10 17l3-3H7l3 3z" />
      </svg>
    );
  }

  if (sortConfig.direction === "asc") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-blue-600 inline ml-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 3l-3 3h6l-3-3z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-blue-600 inline ml-1"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 17l3-3H7l3 3z" />
    </svg>
  );
}

export default IconArrow;

import React from "react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="searchbar">
      <input
        aria-label="Search books by title"
        className="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search books..."}
      />
      <button
        className="clear-btn"
        onClick={() => onChange("")}
        title="Clear"
        aria-label="Clear search"
      >
        ✕
      </button>
    </div>
  );
}

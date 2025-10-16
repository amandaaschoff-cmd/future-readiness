import React from "react";

export function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full h-3 bg-white/20 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

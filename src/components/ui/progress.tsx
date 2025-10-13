import * as React from "react";

export function Progress({ value = 0, className = "" }: { value?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-blue-600 transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

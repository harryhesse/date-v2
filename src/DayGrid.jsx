import React from "react";
import { Info } from "luxon";
import { cls } from "./utility";
import { getDayClasses } from "./calendarHelpers";

export default function DayGrid({ days = [], monthAnchor, handleCellClick }) {
  if (!days.length || !monthAnchor) return null;

  // Monday-first weekday labels
  const weekDays = Info.weekdays("short");

  return (
    <div className="dayGridMonth-view">
      <div
        className="daygrid"
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        }}
      >
        {/* Weekday headers */}
        {weekDays.map((day) => (
          <div key={day} className="daygrid-header-cell">
            {day}
          </div>
        ))}

        {/* Day cells */}
        {days.map((day) => (
          <div
            key={day.key}
            className={cls(getDayClasses(day.date, monthAnchor))}
            onClick={() => handleCellClick(day.date)}
          >
            {day.date.day}
          </div>
        ))}
      </div>
    </div>
  );
}

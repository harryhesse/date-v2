import React from "react";
import { formatHourLabel, handleCellClick } from "./calendarHelpers";

export default function TimeGrid({ days = [], slots = [] }) {
  if (!days.length || !slots.length) return null;

  return (
    <div className="timegrid-scroll-container">
      <div
        className="timegrid"
        style={{
          gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
        }}
      >
        {/* Empty top-left cell */}
        <div className="timegrid-header-cell" />

        {/* Day headers */}
        {days.map((day) => (
          <div key={day.key} className="timegrid-header-cell">
            {day.key}
          </div>
        ))}

        {/* Time rows */}
        {slots.map((slot, index) => (
          <React.Fragment key={slot.label}>
            <div
              style={{ borderTop: index === 0 ? "none" : undefined }}
              className="timegrid-time-cell"
            >
              {formatHourLabel(slot.label, index)}
            </div>

            {days.map((day, i) => (
              <div
                style={{ borderTop: index === 0 ? "none" : undefined }}
                key={`${day.key}-${slot.label}`}
                className="timegrid-cell"
                onClick={() => handleCellClick(day, slot)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

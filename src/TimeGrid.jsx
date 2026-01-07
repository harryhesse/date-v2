import React from "react";
import { formatHourLabel, handleCellClick } from "./calendarHelpers";
import { cls } from "./utility";

export default function TimeGrid({ days = [] }) {
  if (!days.length) return null;

  // Use slots from the first day to build time rows
  const slots = days[0].slots;
  if (!slots?.length) return null;

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
        {slots.map((slot, slotIdx) => (
          <React.Fragment key={slot.datetime.toISO()}>
            {/* Time label */}
            <div
              className={cls(
                "timegrid-time-cell",
                slotIdx === 0 && "border-t-0"
              )}
            >
              {formatHourLabel(slot.label, slotIdx)}
            </div>

            {/* Cells */}
            {days.map((day) => {
              const daySlot = day.slots[slotIdx];

              return (
                <div
                  key={`${day.key}-${slot.datetime.toISOTime()}`}
                  className={cls(
                    "timegrid-cell",
                    slotIdx === 0 && "border-t-0"
                  )}
                  onClick={() => handleCellClick(daySlot.datetime)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

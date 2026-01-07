import { CalendarDateTime } from "@internationalized/date";

import { DateTime } from "luxon";

export function getDayClasses(dayDate, monthAnchor, options = {}) {
  const { highlightWeekends = true, highlightToday = true } = options;
  const classes = ["daygrid-cell"];

  // Outside active month
  if (dayDate.month !== monthAnchor.month) {
    classes.push("other-month");
  }

  // Weekend (ISO: Saturday = 6, Sunday = 7)
  if (highlightWeekends && dayDate.weekday >= 6) {
    classes.push("weekend");
  }

  // Today
  if (highlightToday && dayDate.hasSame(DateTime.local(), "day")) {
    classes.push("today");
  }

  return classes.join(" ");
}

/**
 * Default click handler for cells
 */
export function handleCellClick(dt) {
  console.log(dt.toString());
}

export function formatHourLabel(label, slotIndex) {
  if (slotIndex % 2 !== 0) return "";

  return label.replace(":00 ", "");
}

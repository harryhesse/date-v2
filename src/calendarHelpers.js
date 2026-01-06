import { CalendarDateTime } from "@internationalized/date";

export function getDayClasses(dayDate, monthAnchor, options = {}) {
  const { highlightWeekends = true, highlightToday = true } = options;
  const classes = ["day-cell"];

  if (dayDate.month !== monthAnchor.month) classes.push("other-month");
  if (highlightWeekends && dayDate.weekday >= 5) classes.push("weekend");

  if (highlightToday) {
    const now = new Date();
    if (
      dayDate.year === now.getFullYear() &&
      dayDate.month === now.getMonth() + 1 &&
      dayDate.day === now.getDate()
    ) {
      classes.push("today");
    }
  }

  return classes.join(" ");
}

/**
 * Construct a CalendarDateTime from a day and a slot
 */
export function getDateTime(day, slot) {
  return new CalendarDateTime(
    day.date.year,
    day.date.month,
    day.date.day,
    slot.time.hour,
    slot.time.minute,
    slot.time.second
  );
}

/**
 * Default click handler for cells
 */
export function handleCellClick(day, slot) {
  const dateTime = getDateTime(day, slot);
  console.log(dateTime.toString());
}

export function formatHourLabel(label, slotIndex) {
  if (slotIndex % 2 !== 0) return "";

  return label.replace(":00 ", "");
}

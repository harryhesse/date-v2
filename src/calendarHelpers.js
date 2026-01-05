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

// function MonthView({ days, anchor }) {
//   return (
//     <div className="month-grid">
//       {days.map(day => (
//         <div key={day.key} className={getDayClasses(day.date, anchor)}>
//           {day.date.day}
//         </div>
//       ))}
//     </div>
//   );
// }
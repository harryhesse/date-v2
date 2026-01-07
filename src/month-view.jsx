import { handleCellClick } from "./calendarHelpers";
import DayGrid from "./DayGrid";

export default function MonthView({ data }) {
  const { days, anchor } = data;
  // Group days into weeks (arrays of 7)
  console.log("anchor", anchor);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  console.log(anchor);
  return (
    // <div className="month">
    //   {weeks.map((week, wi) => (
    //     <div className="week" key={wi}>
    //       {week.map((day) => (
    //         <div className="day" key={day.key}>
    //           {/* Optionally style days outside current month */}
    //           <div className="day-number">{day.date.day}</div>

    //           {/* Render hour rows */}
    //         </div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
    <DayGrid
      days={days} // [{year, month, day, weekday}, ...]
      monthAnchor={anchor}
      handleCellClick={(dt) => handleCellClick(dt)}
    />
  );
}

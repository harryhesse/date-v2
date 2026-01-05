export default function MonthView({ days, anchor }) {
  // Group days into weeks (arrays of 7)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <>
      <p>month view</p>
      <div className="month">
        {weeks.map((week, wi) => (
          <div className="week" key={wi}>
            {week.map((day) => (
              <div className="day" key={day.key}>
                {/* Optionally style days outside current month */}
                <div className="day-number">{day.date.day}</div>

                {/* Render hour rows */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

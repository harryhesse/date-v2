export default function DayView({ day }) {
  // console.log(day);
  return (
    <>
      <p>day view</p>
      <div>
        <div className="day">
          {day.hourRows.map((hR, i) => {
            if (hR.slots.length) {
              return (
                <div className="hour" key={hR.hourLabel}>
                  <div className="hour-label">{hR.hourLabel}</div>
                  <div className="hour-slot-group">
                    {hR.slots.map((s, j) => (
                      <div className="hour-slot" key={s.label}>
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null; // Always return something
          })}
        </div>
      </div>
    </>
  );
}

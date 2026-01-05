export default function WeekView({ days }) {
  console.log(days);
  return (
    <>
      <p>week view</p>
      <div className="week">
        {days.map((d, i) => (
          <div className="day" key={d.key}>
            {d.hourRows.map((hR, j) => {
              if (hR.slots.length) {
                return (
                  <div className="hour" key={hR.hourLabel}>
                    {i === 0 && (
                      <div className="hour-label">{hR.hourLabel}</div>
                    )}
                    <div className="hour-slot-group">
                      {hR.slots.map((s, k) => (
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
        ))}
      </div>
    </>
  );
}

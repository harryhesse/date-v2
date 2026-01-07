import { useState } from "react";
import { CalendarDataAPI, VIEWS } from "./calendarDataApi";
import DayView from "./day-view";
import WeekView from "./week-view";
import MonthView from "./month-view";
import { DateTime } from "luxon";

// Placeholder events stored as ISO strings
const placeholderEvents = [
  {
    id: "1",
    title: "Morning Meeting",
    start: "2026-01-06T09:00:00",
    end: "2026-01-06T10:30:00",
  },
  {
    id: "2",
    title: "Lunch Break",
    start: "2026-01-06T12:00:00",
    end: "2026-01-06T13:00:00",
  },
  {
    id: "3",
    title: "Multi-Day Event",
    start: "2026-01-06T14:00:00",
    end: "2026-01-08T16:30:00",
  },
  {
    id: "4",
    title: "Overlapping Event",
    start: "2026-01-06T09:30:00",
    end: "2026-01-06T11:00:00",
  },
];

function App() {
  CalendarDataAPI.setOptions({ startHour: 8, endHour: 18, slotMinutes: 30 });
  const [view, setView] = useState(VIEWS.WEEK);
  const [data, setData] = useState(CalendarDataAPI.getView(VIEWS.WEEK));

  const next = () => setData(CalendarDataAPI.next(view));
  const prev = () => setData(CalendarDataAPI.prev(view));
  const today = () => setData(CalendarDataAPI.today(view));

  const switchView = (v) => {
    setView(v);
    setData(CalendarDataAPI.getView(v));
  };

  // Map ISO events to grid indices for UI
  const mapEventsToGrid = (events, data) => {
    const days = data.days || [];
    const slots = days[0]?.slots || [];

    return events.map((ev) => {
      const startDayIndex = days.findIndex(
        (d) => d.key === ev.start.slice(0, 10)
      );
      const endDayIndex = days.findIndex((d) => d.key === ev.end.slice(0, 10));

      const slotLabels = slots.map((s) => s.label);

      const startTime = new Date(ev.start).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      const endTime = new Date(ev.end).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      const startSlotIndex = slotLabels.indexOf(startTime);
      const endSlotIndex = slotLabels.indexOf(endTime);

      return {
        ...ev,
        startDayIndex,
        endDayIndex,
        startSlotIndex: startSlotIndex >= 0 ? startSlotIndex : 0,
        endSlotIndex: endSlotIndex >= 0 ? endSlotIndex : slots.length - 1,
      };
    });
  };

  const events = mapEventsToGrid(placeholderEvents, data);
  console.log(data);

  function renderView(data) {
    switch (data.type) {
      case VIEWS.DAY:
        return <DayView data={data} />;

      case VIEWS.WEEK:
        return <WeekView data={data} />;

      case VIEWS.MONTH:
        return <MonthView data={data} />;

      default:
        return null;
    }
  }

  return (
    <div className="scheduler">
      <div className="scheduler-header">
        <div className="schuduler-title">{data.anchor.toString()}</div>
        <div className="scheduler-actions">
          <div className="scheduler-navigation">
            <button onClick={prev}>Prev</button>
            <button onClick={today}>Today</button>
            <button onClick={next}>Next</button>
          </div>

          <div className="scheduler-toggle-view">
            <button onClick={() => switchView(VIEWS.DAY)}>Day</button>
            <button onClick={() => switchView(VIEWS.WEEK)}>Week</button>
            <button onClick={() => switchView(VIEWS.MONTH)}>Month</button>
          </div>

          <button>Add event</button>
        </div>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <div className="scheduler-content">{renderView(data)}</div>
    </div>
  );
}

export default App;

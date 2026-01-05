import { useState } from "react";
import { CalendarDataAPI, VIEWS } from "./calendarDataApi";
import DayView from "./day-view";
import WeekView from "./week-view";
import MonthView from "./month-view";

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

  function renderView(data) {
    switch (data.type) {
      case VIEWS.DAY:
        return <DayView day={data.days[0]} />;

      case VIEWS.WEEK:
        return <WeekView days={data.days} />;

      case VIEWS.MONTH:
        return <MonthView days={data.days} />;

      default:
        return null;
    }
  }

  return (
    <>
      <button onClick={prev}>Prev</button>
      <button onClick={today}>Today</button>
      <button onClick={next}>Next</button>

      <button onClick={() => switchView(VIEWS.DAY)}>Day</button>
      <button onClick={() => switchView(VIEWS.WEEK)}>Week</button>
      <button onClick={() => switchView(VIEWS.MONTH)}>Month</button>

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      {renderView(data)}
    </>
  );
}

export default App;

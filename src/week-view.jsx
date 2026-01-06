import TimeGrid from "./TimeGrid";

export default function WeekView({ data }) {
  const { anchor, days, slots } = data;
  return (
    <div className="timeGridWeek-view">
      <div className="timegrid-header">{anchor.toString()}</div>
      <hr />
      <TimeGrid days={days} slots={slots} />
    </div>
  );
}

import TimeGrid from "./TimeGrid";

export default function DayView({ data }) {
  const { anchor, days, slots } = data;
  const SLOT_HEIGHT =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--slot-height"
      )
    ) || 40;

  return (
    <div className="timeGridDay-view">
      <div className="timegrid-header">{anchor.toString()}</div>
      <hr />
      <TimeGrid days={days} slots={slots} foo={"day"} />
    </div>
  );
}

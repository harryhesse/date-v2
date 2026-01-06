import { CalendarDate, Time, today } from "@internationalized/date";

/* ---------------------------------------------
   Constants
--------------------------------------------- */
export const VIEWS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
};

/* ---------------------------------------------
   Formatting helpers
--------------------------------------------- */
function formatTime(hour, minute) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function formatHourLabel(hour) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${h12} ${period}`;
}

/* ---------------------------------------------
   Slot factory (shared)
--------------------------------------------- */
function createSlots({ startHour, endHour, slotMinutes }) {
  const slots = [];

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += slotMinutes) {
      slots.push({
        time: new Time(h, m),
        label: formatTime(h, m),
      });
    }
  }

  return slots;
}

/* ---------------------------------------------
   Day factory (pure)
--------------------------------------------- */
function createDay(date) {
  return {
    date,
    key: date.toString(),
  };
}

/* ---------------------------------------------
   Normalization (anchors)
--------------------------------------------- */
function normalizeWeek(date) {
  return date.subtract({ days: date.dayOfWeek });
}

function normalizeMonth(date) {
  const first = new CalendarDate(date.year, date.month, 1);
  return first.subtract({ days: first.dayOfWeek });
}

/* ---------------------------------------------
   Builders (views)
--------------------------------------------- */
function buildDay(date, options) {
  return {
    type: VIEWS.DAY,
    anchor: date,
    slots: createSlots(options),
    days: [createDay(date)],
  };
}

function buildWeek(date, options) {
  const start = normalizeWeek(date);

  return {
    type: VIEWS.WEEK,
    anchor: start,
    slots: createSlots(options),
    days: Array.from({ length: 7 }, (_, i) =>
      createDay(start.add({ days: i }))
    ),
  };
}

function buildMonth(date, options) {
  const start = normalizeMonth(date);

  return {
    type: VIEWS.MONTH,
    anchor: start,
    slots: createSlots(options),
    days: Array.from({ length: 42 }, (_, i) =>
      createDay(start.add({ days: i }))
    ),
  };
}

/* ---------------------------------------------
   Navigation helpers
--------------------------------------------- */
function nextDate(view, date) {
  switch (view) {
    case VIEWS.DAY:
      return date.add({ days: 1 });
    case VIEWS.WEEK:
      return normalizeWeek(date).add({ days: 7 });
    case VIEWS.MONTH:
      return new CalendarDate(date.year, date.month, 1).add({ months: 1 });
    default:
      return date;
  }
}

function prevDate(view, date) {
  switch (view) {
    case VIEWS.DAY:
      return date.subtract({ days: 1 });
    case VIEWS.WEEK:
      return normalizeWeek(date).subtract({ days: 7 });
    case VIEWS.MONTH:
      return new CalendarDate(date.year, date.month, 1).subtract({ months: 1 });
    default:
      return date;
  }
}

/* ---------------------------------------------
   Public API
--------------------------------------------- */
export const CalendarDataAPI = (() => {
  let cursor = today();

  let defaultOptions = {
    startHour: 0,
    endHour: 24,
    slotMinutes: 30,
  };

  function getView(view, date = cursor, options = defaultOptions) {
    cursor = date;

    switch (view) {
      case VIEWS.DAY:
        return buildDay(cursor, options);
      case VIEWS.WEEK:
        return buildWeek(cursor, options);
      case VIEWS.MONTH:
        return buildMonth(cursor, options);
      default:
        throw new Error("Invalid calendar view");
    }
  }

  return {
    getView,

    next(view, options) {
      cursor = nextDate(view, cursor);
      return getView(view, cursor, options ?? defaultOptions);
    },

    prev(view, options) {
      cursor = prevDate(view, cursor);
      return getView(view, cursor, options ?? defaultOptions);
    },

    today(view, options) {
      cursor = today();
      return getView(view, cursor, options ?? defaultOptions);
    },

    setOptions(options) {
      defaultOptions = { ...defaultOptions, ...options };
    },
  };
})();

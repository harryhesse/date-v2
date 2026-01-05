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
   Helpers
--------------------------------------------- */
function formatTime(hour, minute) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}

function formatHourLabel(hour) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${h12} ${period}`;
}

/* ---------------------------------------------
   Group slots by hour
--------------------------------------------- */
function groupSlotsByHour(slots, slotMinutes = 30) {
  const rows = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    hourLabel: formatHourLabel(h),
    slots: [],
  }));

  for (const slot of slots) {
    rows[slot.time.hour].slots.push(slot);
  }

  return rows;
}

/* ---------------------------------------------
   Day factory (configurable)
--------------------------------------------- */
function createDay(
  date,
  options = { startHour: 0, endHour: 24, slotMinutes: 30 }
) {
  const { startHour, endHour, slotMinutes } = options;
  const slots = [];

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += slotMinutes) {
      slots.push({
        time: new Time(h, m),
        label: formatTime(h, m),
      });
    }
  }

  return {
    date,
    key: date.toString(),
    slots,
    hourRows: groupSlotsByHour(slots, slotMinutes),
  };
}

/* ---------------------------------------------
   Normalization (anchors)
--------------------------------------------- */
function normalizeWeek(date) {
  return date.subtract({ days: date.dayOfWeek });
}

function normalizeMonth(date) {
  const firstOfMonth = new CalendarDate(date.year, date.month, 1);
  return firstOfMonth.subtract({ days: firstOfMonth.dayOfWeek });
}

/* ---------------------------------------------
   Builders (views)
--------------------------------------------- */
function buildDay(date, options) {
  return {
    type: VIEWS.DAY,
    anchor: date,
    days: [createDay(date, options)],
  };
}

function buildWeek(date, options) {
  const start = normalizeWeek(date);

  return {
    type: VIEWS.WEEK,
    anchor: start,
    days: Array.from({ length: 7 }, (_, i) =>
      createDay(start.add({ days: i }), options)
    ),
  };
}

function buildMonth(date, options) {
  const start = normalizeMonth(date);

  return {
    type: VIEWS.MONTH,
    anchor: start,
    days: Array.from({ length: 42 }, (_, i) =>
      createDay(start.add({ days: i }), options)
    ),
  };
}

/* ---------------------------------------------
   Navigation
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
   Public API v2
--------------------------------------------- */
export const CalendarDataAPI = (() => {
  let cursor = today();

  // Default configuration
  let defaultOptions = { startHour: 0, endHour: 24, slotMinutes: 30 };

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

    next(view, options = defaultOptions) {
      cursor = nextDate(view, cursor);
      return getView(view, cursor, options);
    },

    prev(view, options = defaultOptions) {
      cursor = prevDate(view, cursor);
      return getView(view, cursor, options);
    },

    today(view, options = defaultOptions) {
      cursor = today();
      return getView(view, cursor, options);
    },

    // Allow changing default slot/hour config
    setOptions(options) {
      defaultOptions = { ...defaultOptions, ...options };
    },
  };
})();

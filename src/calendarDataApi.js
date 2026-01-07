import { DateTime, Info } from "luxon";

/* ---------------------------------------------
   Constants
--------------------------------------------- */
export const VIEWS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
};

/* ---------------------------------------------
   Locale (first-class)
--------------------------------------------- */
let locale = DateTime.local().locale;

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
   Slot factory (REAL DateTimes)
--------------------------------------------- */
function createSlots(date, { startHour, endHour, slotMinutes }) {
  const slots = [];
  const base = date.startOf("day");

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += slotMinutes) {
      const datetime = base.set({
        hour: h,
        minute: m,
        second: 0,
        millisecond: 0,
      });

      slots.push({
        datetime,
        label: formatTime(h, m),
      });
    }
  }

  return slots;
}

/* ---------------------------------------------
   Day factory
--------------------------------------------- */
function createDay(date, options) {
  const d = date.startOf("day");

  return {
    date: d,
    key: d.toISODate(),
    slots: createSlots(d, options),
  };
}

/* ---------------------------------------------
   Locale-aware week helpers
--------------------------------------------- */
function startOfWeek(date) {
  const firstDay = Info.getStartOfWeek({ locale: date.locale });
  const diff = (date.weekday - firstDay + 7) % 7;
  return date.minus({ days: diff }).startOf("day");
}

function endOfWeek(date) {
  return startOfWeek(date).plus({ days: 6 }).endOf("day");
}

/* ---------------------------------------------
   Month normalization (full weeks)
--------------------------------------------- */
function normalizeMonth(date) {
  const firstOfMonth = date.startOf("month");
  const lastOfMonth = date.endOf("month");

  return {
    start: startOfWeek(firstOfMonth),
    end: endOfWeek(lastOfMonth),
  };
}

/* ---------------------------------------------
   Builders
--------------------------------------------- */
function buildDay(date, options) {
  const d = date.startOf("day");

  return {
    type: VIEWS.DAY,
    anchor: d,
    days: [createDay(d, options)],
  };
}

function buildWeek(date, options) {
  const start = startOfWeek(date);

  return {
    type: VIEWS.WEEK,
    anchor: start,
    days: Array.from({ length: 7 }, (_, i) =>
      createDay(start.plus({ days: i }), options)
    ),
  };
}

function buildMonth(date, options) {
  const monthAnchor = date.startOf("month");
  const { start, end } = normalizeMonth(date);

  const days = [];
  let cursor = start;

  while (cursor <= end) {
    days.push(createDay(cursor, options));
    cursor = cursor.plus({ days: 1 });
  }

  return {
    type: VIEWS.MONTH,
    anchor: monthAnchor,
    days,
  };
}

/* ---------------------------------------------
   Navigation helpers
--------------------------------------------- */
function nextDate(view, date) {
  switch (view) {
    case VIEWS.DAY:
      return date.plus({ days: 1 });
    case VIEWS.WEEK:
      return startOfWeek(date).plus({ weeks: 1 });
    case VIEWS.MONTH:
      return date.startOf("month").plus({ months: 1 });
    default:
      return date;
  }
}

function prevDate(view, date) {
  switch (view) {
    case VIEWS.DAY:
      return date.minus({ days: 1 });
    case VIEWS.WEEK:
      return startOfWeek(date).minus({ weeks: 1 });
    case VIEWS.MONTH:
      return date.startOf("month").minus({ months: 1 });
    default:
      return date;
  }
}

/* ---------------------------------------------
   Public API
--------------------------------------------- */
export const CalendarDataAPI = (() => {
  let cursor = DateTime.local().setLocale(locale).startOf("day");

  let defaultOptions = {
    startHour: 0,
    endHour: 24,
    slotMinutes: 30,
  };

  function getView(view, date = cursor, options = defaultOptions) {
    cursor = date.setLocale(locale);

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
      cursor = DateTime.local().setLocale(locale).startOf("day");
      return getView(view, cursor, options ?? defaultOptions);
    },

    setOptions(options) {
      defaultOptions = { ...defaultOptions, ...options };
    },

    setLocale(newLocale) {
      locale = newLocale;
      cursor = cursor.setLocale(locale);
    },
  };
})();

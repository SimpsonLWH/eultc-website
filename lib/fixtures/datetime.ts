const LONDON_TIME_ZONE = "Europe/London";

const londonPartsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: LONDON_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const wideDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: LONDON_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

function partValue(
  parts: Intl.DateTimeFormatPart[],
  type: string
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function londonOffsetMinutes(instant: Date): number {
  // Minutes Europe/London is ahead of UTC at this instant: 0 (GMT) or +60 (BST).
  const parts = londonPartsFormatter.formatToParts(instant);
  const wholeMinutes = Math.floor(instant.getTime() / 60000) * 60000;
  const wallMinutes = Date.UTC(
    Number(partValue(parts, "year")),
    Number(partValue(parts, "month")) - 1,
    Number(partValue(parts, "day")),
    Number(partValue(parts, "hour")),
    Number(partValue(parts, "minute"))
  );
  return Math.round((wallMinutes - wholeMinutes) / 60000);
}

/**
 * Turns a UK wall-clock date and time into the matching UTC instant.
 * Returns null for malformed input and for times that do not exist on that
 * date because of the spring-forward clock change. The ambiguous fall-back
 * hour resolves to the first (BST) occurrence.
 */
export function londonWallTimeToUtc(
  date: string,
  time: string
): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time.trim());
  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59) {
    return null;
  }

  const wallMinutes = Date.UTC(year, month - 1, day, hour, minute);
  const calendarCheck = new Date(wallMinutes);
  if (
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() !== month - 1 ||
    calendarCheck.getUTCDate() !== day
  ) {
    return null;
  }

  // UK offsets are only ever 0 or +60. Try BST first so an ambiguous
  // fall-back wall time picks the first occurrence.
  for (const offset of [60, 0]) {
    const candidate = new Date(wallMinutes - offset * 60000);
    if (londonOffsetMinutes(candidate) === offset) {
      return candidate;
    }
  }

  return null;
}

export function formatLondonDate(instant: Date): string {
  const parts = wideDateFormatter.formatToParts(instant);
  return `${partValue(parts, "weekday")} ${partValue(parts, "day")} ${partValue(parts, "month")}`;
}

export function formatLondonTime(instant: Date): string {
  return formatLondonTimeInput(instant);
}

export function formatLondonDateTime(instant: Date): string {
  return `${formatLondonDate(instant)}, ${formatLondonTime(instant)}`;
}

/** Value for an `<input type="date">` in UK club time. */
export function formatLondonDateInput(instant: Date): string {
  const parts = londonPartsFormatter.formatToParts(instant);
  return `${partValue(parts, "year")}-${partValue(parts, "month")}-${partValue(parts, "day")}`;
}

/** Value for an `<input type="time">` in UK club time. */
export function formatLondonTimeInput(instant: Date): string {
  const parts = londonPartsFormatter.formatToParts(instant);
  return `${partValue(parts, "hour")}:${partValue(parts, "minute")}`;
}

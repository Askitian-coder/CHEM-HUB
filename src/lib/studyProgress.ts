const DAY_IN_MILLISECONDS = 86_400_000;

function shiftUtcDate(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function getStudyStreak(activityDates: string[], now = new Date()): number {
  const recordedDates = new Set(activityDates);
  const today = now.toISOString().slice(0, 10);
  const yesterday = shiftUtcDate(today, -1);

  if (!recordedDates.has(today) && !recordedDates.has(yesterday)) return 0;

  let date = recordedDates.has(today) ? today : yesterday;
  let streak = 0;

  while (recordedDates.has(date)) {
    streak += 1;
    date = shiftUtcDate(date, -1);
  }

  return streak;
}

export function getRecentStudyDays(activityDates: string[], now = new Date()): number {
  const recordedDates = new Set(activityDates);
  const today = now.toISOString().slice(0, 10);
  let days = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    if (recordedDates.has(shiftUtcDate(today, -offset))) days += 1;
  }

  return days;
}

export function getUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getStudyDateOffset(dateKey: string, now = new Date()): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((today - date) / DAY_IN_MILLISECONDS);
}

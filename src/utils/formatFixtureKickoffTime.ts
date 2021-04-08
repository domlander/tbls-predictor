import { days, months, pad } from "@/utils";

export function formatFixtureKickoffTime(dateInput: Date | string) {
  const fixture: Date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const monthIndex = fixture.getUTCMonth();
  const dayIndex = fixture.getUTCDay();

  const dayOfMonth = pad(fixture.getUTCDate());
  const month = months[monthIndex].substring(0, 3);
  const day = days[dayIndex];
  const hours = pad(fixture.getUTCHours());
  const minutes = pad(fixture.getUTCMinutes());

  // Note an edge case here: If the match is 7 days away, the match is classified as being far away
  const thisDayNextWeek = new Date();
  thisDayNextWeek.setDate(thisDayNextWeek.getDate() + 7);
  const isMatchFarAway = fixture > thisDayNextWeek;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isMatchInPast = fixture < yesterday;

  if (isMatchFarAway) {
    return `${day} ${dayOfMonth} ${month}`;
  }

  if (isMatchInPast) {
    return `${dayOfMonth}/${pad(monthIndex + 1)} ${hours}:${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

// 16/04 19:45  `${dayOfMonth}/${pad(monthIndex + 1)} ${hours}:${minutes}`;
// Fri 16 Apr   `${day} ${dayOfMonth} ${month}`;
// Fri 16/04    `${day} ${dayOfMonth}/${pad(monthIndex + 1)}`;
// 19:45        `${hours}:${minutes}`;

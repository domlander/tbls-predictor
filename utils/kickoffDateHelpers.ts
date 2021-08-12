import { days, months, pad } from "./dateHelpers";

type DateFormat = "past" | "today" | "soon" | "future";

const getLocalKickoffTime = (dateInput: Date | string) => {
  const fixtureUTC: Date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  return new Date(
    fixtureUTC.setMinutes(
      fixtureUTC.getMinutes() - new Date().getTimezoneOffset()
    )
  );
};

export function formatFixtureKickoffTime(
  dateInput: Date | string,
  format: DateFormat = "future"
) {
  const fixture = getLocalKickoffTime(dateInput);

  const monthIndex = fixture.getUTCMonth();
  const dayIndex = fixture.getUTCDay();

  const dayOfMonth = pad(fixture.getUTCDate());
  const month = months[monthIndex].substring(0, 3);
  const day = days[dayIndex];
  const hours = pad(fixture.getUTCHours());
  const minutes = pad(fixture.getUTCMinutes());

  if (format === "past") {
    return `${dayOfMonth}/${pad(monthIndex + 1)} ${hours}:${minutes}`;
  }

  if (format === "today") {
    return `${hours}:${minutes}`;
  }

  if (format === "soon") {
    return `${day} ${hours}:${minutes}`;
  }

  return `${day} ${dayOfMonth} ${month}`;
}

// 16/04 19:45  past   `${dayOfMonth}/${pad(monthIndex + 1)} ${hours}:${minutes}`;
// 19:45        today  `${hours}:${minutes}`;
// Fri 16 Apr   soon   `${day} ${dayOfMonth} ${month}`;
// Fri 16/04    future `${day} ${dayOfMonth}/${pad(monthIndex + 1)}`;

export function whenIsTheFixture(dateInput: Date | string) {
  const fixture = getLocalKickoffTime(dateInput);

  // Note an edge case here: If the match is 7 days away, the match is classified as being far away
  const thisDayNextWeek = new Date();
  thisDayNextWeek.setDate(thisDayNextWeek.getDate() + 7);
  if (fixture > thisDayNextWeek) {
    return "future";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 6);
  if (fixture < yesterday) {
    return "past";
  }

  const today = new Date();
  if (fixture.toDateString() === today.toDateString()) {
    return "today";
  }

  return "soon";
}

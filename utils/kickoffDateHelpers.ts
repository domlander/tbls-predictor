import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

export type FixtureDateTimeFormat =
  /**
   * Yesterday or earlier
   */
  | "past"
  /**
   * Today
   */
  | "today"
  /**
   * Between tomorrow and 6 days from now
   */
  | "soon"
  /**
   * At least 7 days or more in the future
   */
  | "future";

dayjs.extend(utc);
dayjs.extend(tz);

/**
 * 16/04 19:45  past   `${dayOfMonth}/${pad(monthIndex + 1)} ${hours}:${minutes}`;
 * 19:45        today  `${hours}:${minutes}`;
 * Fri 16 Apr   soon   `${day} ${dayOfMonth} ${month}`;
 * Fri 16/04    future `${day} ${dayOfMonth}/${pad(monthIndex + 1)}`;
 */
const dateFormatDictionary = {
  past: "DD/MM HH:mm",
  today: "HH:mm",
  soon: "ddd HH:mm",
  future: "ddd D MMM",
};

const getLocalKickoffTime = (dateInput: Date | string) => {
  const fixture: Date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const isKickoffInBST = dayjs(fixture)
    .toDate()
    .toString()
    .includes("British Summer Time");

  const incrementForBST = isKickoffInBST ? 60 : 0;

  return dayjs(fixture)
    .subtract(dayjs(fixture).utcOffset(), "minutes")
    .add(incrementForBST, "minutes")
    .tz(dayjs.tz.guess()) // Guess the user's timezone
    .toDate();
};

export function formatFixtureKickoffTime(
  dateInput: Date | string,
  when: FixtureDateTimeFormat = "future"
) {
  const localTime = getLocalKickoffTime(dateInput);
  const dateFormat = dateFormatDictionary[when];

  return dayjs(localTime).format(dateFormat);
}

export function whenIsTheFixture(
  dateInput: Date | string
): FixtureDateTimeFormat {
  const fixture = getLocalKickoffTime(dateInput);

  // Edge case: If the match is 7 days away, the match is classified as being far away
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

  return "soon";
}

export const getShortDateKickoffTime = (dateInput: Date | string) => {
  const localTime = getLocalKickoffTime(dateInput);
  return dayjs(localTime).format("D MMM");
};

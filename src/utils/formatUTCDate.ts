export function formatUTCDate(dateInput: Date | string) {
  const date: Date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const dayIndex = date.getUTCDay();
  const day = days[dayIndex];

  const hours = date.getUTCHours();
  const formattedHours = hours < 10 ? `0${hours.toString()}` : hours.toString();

  const minutes = date.getUTCMinutes();
  const formattedMinutes =
    minutes < 10 ? `0${minutes.toString()}` : minutes.toString();

  // TODO : If fixture is over 6 whole days away (if it's Friday today, then the game is next Friday or after) then show date
  return `${day} ${formattedHours}:${formattedMinutes}`;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

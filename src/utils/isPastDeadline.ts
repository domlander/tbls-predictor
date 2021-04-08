export function isPastDeadline(kickoff: Date) {
  const now = new Date();
  const kickOffDate = new Date(kickoff);
  const deadline = new Date(
    kickOffDate.setUTCMinutes(kickOffDate.getUTCMinutes() - 90)
  );

  return now > deadline;
}

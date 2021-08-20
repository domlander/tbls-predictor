const minutesBeforeKickoff = 90;

const isPastDeadline = (input: Date | string) => {
  let kickoff;
  if (typeof kickoff === "string") {
    kickoff = new Date(kickoff);
  } else {
    kickoff = input;
  }

  const now = new Date();
  const kickOffDate = new Date(kickoff);
  const deadline = new Date(
    kickOffDate.setTime(
      kickOffDate.getTime() - minutesBeforeKickoff * 60 * 1000
    )
  );

  return now > deadline;
};

export default isPastDeadline;

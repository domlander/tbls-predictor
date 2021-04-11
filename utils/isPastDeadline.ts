const minutesBeforeKickoff = 90;

const isPastDeadline = (kickoff: Date) => {
  const now = new Date();
  const kickOffDate = new Date(kickoff);
  const deadline = new Date(
    kickOffDate.setTime(
      kickOffDate.getTime() -
        minutesBeforeKickoff * 60 * 1000 +
        kickOffDate.getTimezoneOffset() * 60 * 1000
    )
  );

  return now > deadline;
};

export default isPastDeadline;

import { getSession } from 'next-auth/client';

const isUserBelongToLeague = (participants, userId) => {
  return participants.some(p => p.id === userId)
}

const isUserAppliedToLeague = (applicants, userId) => {
  return applicants.some(p => p.userId === userId && p.status === 'applied')
}

// A user has requested to join an existing league
export default async (req, res) => {
  const session = await getSession({ req })
  const leagueId = parseInt(req.body.id)

  if (!session?.user.id) {
    return res.status(400).send('Cannot process request. User not found.');
  }

  if (!leagueId || typeof leagueId !== 'number' || leagueId < 1) {
    return res.status(400).send('Cannot process request. League ID not valid.');
  }

  const userId = session?.user.id

  // If user is already participant or an applicant, don't add them as an applicant to
  // avoid adding a player to the same league twice or creating duplicate requests
  const league = await prisma.league.findUnique({
    where: {
      id: leagueId
    },
    include: {
      users: true,
      applicants: true
    }
  })

  if (!league) {
    return res.status(400).send('Cannot process request. League not found.');
  }

  if (isUserBelongToLeague(league.users, userId)) {
    return res.status(400).send('Cannot process request. User already belongs to league.');
  }

  if (isUserAppliedToLeague(league.applicants, userId)) {
    return res.status(400).send('Cannot process request. User already has an open application to league.');
  }

  await prisma.leagueApplicants.create({
    data: {
      leagueId: leagueId,
      applicantId: session.user.id
    }
  })
  console.log(`Created application to league ${league.name} for user ${session?.user.email}`)

  res.send(200);
};
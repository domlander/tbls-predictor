# TBLS Predictor League

A free-to-play Premier League football scores predictor game. Create or join leagues to compare your predictions in a league table with your friends.

## How do I play?

[https://www.desmondtwotwo.com/signIn/](https://www.desmondtwotwo.com/signIn/)

Enter your predictions for the current gameweek and select a game to you feel confident in to double your points. Three points for a correct score. One point for a correct result. The deadline for a prediction is 90 minutes before kick-off.

## When can I add predictions?

Right away, once you have signed up. We use passwordless login, so all you need is your email.

## Can I play with friends?

Sure. Navigate to the "Create League" section and share the league code with your friends. If your friend has already created a league, go to the "Join League" section to join their league.

## When do I need to add a prediction for a match?

Fixtures are usually added two gameweeks in advance. Predictions for a match lock 90 minutes before kickoff, so enter your score in before then. If you forget, a default score of 0-0 will apply, so you won't miss out completely!

## Tech Section

### Stack

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
- [Apollo GraphQL](https://www.apollographql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Prisma data proxy](https://www.prisma.io/docs/concepts/components/prisma-data-platform)
- [Styled components](https://styled-components.com/)

This project was initialised using one of the Next.js example projects:

- [with-typescript-styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-typescript-styled-components)

### Services

- Populate fixtures: Uses the FPL fixtures API (thank you Premier League :pray:) to populate fixtures in the database.
- Update fixture results: Updates the score of a Premier League match. Evaluates the score of all predictions for this fixtures.
- Update predictions: Set the prediction to 0-0 for users that missed the deadline (In development...).

### Technical challenges

1. Initially wanted to use Mongo, but data is highly relational which meant SQL was a better fit.
1. Prisma's documentation isn't clear with regards to explicit many-to-many relationships. Followed the answer provided here as an implementation guide: https://github.com/prisma/prisma/issues/2162

### Preparation for new season

- Create database (Currently using Render.com)
- Update env variables in `.env`: `DATABASE_URL`, `RAW_DATABASE_URL`
- Update env variables in Vercel
- Sign in to `cloud.prisma.io` and create a new environment with new db connection
- Update `teamsDictionary` in `fplApi.ts` with updated teams for new season
- Add trigger to database for prediction audit

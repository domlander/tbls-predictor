# TBLS Predictor League

Predict footy scores to beat your mates and inflate your ego in a completely new way.

## How do I play?

[https://www.desmondtwotwo.com/](https://www.desmondtwotwo.com/)

## When can I add predictions?

Right away, once you have signed up. We use passwordless login, so all you need is your email.

## Can I play with friends?

Sure. Navigate to the "Create League" section and share the league code with your friends. You will be able to accept your friends requests to join your league

## When do I need to add a prediction for a match?

Fixtures are usually added two weeks in advance. Predictions for a match lock 90 minutes before kickoff, so enter your score in before then. If you forget, a default score of 0-0 will apply.

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

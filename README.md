# TBLS Predictor League

Predict footy scores to beat your mates and inflate your ego in a completely new way.

## What's the URL?

[https://www.desmondtwotwo.com/](https://www.desmondtwotwo.com/)

## Tech Stack

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
- [Apollo GraphQL](https://www.apollographql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Prisma data proxy](https://www.prisma.io/docs/concepts/components/prisma-data-platform)
- [Styled components](https://styled-components.com/)

This project was initialised using one of the Next.js example projects:

- [with-typescript-styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-typescript-styled-components)

## Technical challenges

1. Initially wanted to use Mongo, but data is highly relational which meant SQL was a better fit.
1. Prisma's documentation isn't clear with regards to explicit many-to-many relationships. Followed the answer provided here as an implementation guide: https://github.com/prisma/prisma/issues/2162

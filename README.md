# TBLS Predictor League

Predict scores for the footy to inflate your ego by beating your mates in a completely new way.

## How to use it?

This is an amalgamation of 2 existing examples:

- [with-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-typescript)
- [with-styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)

## Problems

# Prisma doesn't handle many-to-many relationships well / the documentation isn't clear

- Solution: For implicit relationships, where you want to create a league and link a user, do this:

```
const league = await prisma.league.create({
    data: {
      name: "TBLS"
      users: {
        connect: {
          id: user.id
        }
      }
    }
  })
```

For explicit many-to-many relationships, follow the answer provided here: https://github.com/prisma/prisma/issues/2162

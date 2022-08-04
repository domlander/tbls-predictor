## Database

There is a postgresql database hosted with Heroku.

Heroku rotates credentials periodically and updates applications where this database is attached.

## Identity

We use [NextAuth.js](https://github.com/nextauthjs/next-auth) and the postgresql database to achieve sign in functionality.

## Data Proxy

We use [Prisma data proxy](https://www.prisma.io/docs/concepts/components/prisma-data-platform) as a proxy between the database and the application, as this will handle multiple requests better. Our free tier on Heroku allows up to 20 concurrent requests which can max out quickly.

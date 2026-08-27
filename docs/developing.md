## Database

There is a postgresql database.

## Identity

We use [Better-Auth.js](https://better-auth.com/) and the postgresql database for sign in.

## Data Proxy

We use [Prisma data proxy](https://www.prisma.io/docs/concepts/components/prisma-data-platform) as a proxy between the database and the application, as this will handle multiple requests better. Our free tier on Heroku allows up to 20 concurrent requests which can max out quickly.

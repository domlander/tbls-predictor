import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    }),
  ],
  database: {
    type: "postgres",
    host: process.env.POSTGRESQL_HOST,
    port: 5432,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    ssl: process.env.ENVIRONMENT !== "local",
    extra: {
      ssl:
        process.env.ENVIRONMENT === "local"
          ? false
          : {
              rejectUnauthorized: false,
            },
    },
  },
  secret: process.env.SECRET,
  callbacks: {
    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    async session(session, token) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);

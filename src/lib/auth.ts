import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";



const mongoClient = new MongoClient(process.env.MONGODB_URI!);

const database = mongoClient.db("social_development_events");

export const auth = betterAuth({
  database: mongodbAdapter(database),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
  ],

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.BETTER_AUTH_URL,
        expirationTime: "1h",
      },
    }),
  ],
});
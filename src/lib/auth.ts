
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Environment variables
const mongoUri = process.env.MONGODB_URI;
const authUrl = process.env.BETTER_AUTH_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

// Validate environment variables
if (!mongoUri) {
  throw new Error("MONGODB_URI is missing");
}

if (!authUrl) {
  throw new Error("BETTER_AUTH_URL is missing");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

// MongoDB connection
const mongoClient = new MongoClient(mongoUri);

const database = mongoClient.db("social_development_events");

// Trusted origins
const trustedOrigins = [
  new URL(authUrl).origin,

  // Vercel Preview Deployments for this project
  "https://rooted-bd-client-*-tarek-hasan.vercel.app",
];

// Allow localhost only during development
if (process.env.NODE_ENV === "development") {
  trustedOrigins.push(
    "http://localhost:3000",
    "http://localhost:3001"
  );
}

// Better Auth configuration
export const auth = betterAuth({
  database: mongodbAdapter(database),

  baseURL: authUrl,

  secret: authSecret,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },

  plugins: [
    jwt({
      jwt: {
        issuer: authUrl,
        audience: authUrl,
        expirationTime: "1h",
      },
    }),
  ],
});

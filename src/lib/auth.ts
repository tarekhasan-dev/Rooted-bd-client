
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin as adminPlugin, jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

import {
  ac,
  admin,
  organizer,
  user,
} from "@/lib/permissions";

// Environment variables
const mongoUri = process.env.MONGODB_URI;
const authUrl = process.env.BETTER_AUTH_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

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

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is missing");
}

if (!resendFromEmail) {
  throw new Error("RESEND_FROM_EMAIL is missing");
}

// Resend Email Client
const resend = new Resend(resendApiKey);

// MongoDB connection
const mongoClient = new MongoClient(mongoUri);
const database = mongoClient.db("social_development_events");

// Trusted origins
const trustedOrigins = [
  new URL(authUrl).origin,
  "https://rooted-bd-client-*-tarek-hasan.vercel.app",
];

// Allow localhost only during development
if (process.env.NODE_ENV === "development") {
  trustedOrigins.push(
    "http://localhost:3000",
    "http://localhost:3001"
  );
}

// BetterAuth configuration
export const auth = betterAuth({
  database: mongodbAdapter(database),

  baseURL: authUrl,

  secret: authSecret,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 16,

    // Revoke existing sessions after password reset
    revokeSessionsOnPasswordReset: true,

    // Send Password Reset Email
    sendResetPassword: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: `Rooted BD <${resendFromEmail}>`,
          to: user.email,
          subject: "Reset Your Rooted BD Password",

          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px;">
              <h2>Password Reset Request</h2>

              <p>
                We received a request to reset your Rooted BD account password.
              </p>

              <p>
                Click the button below to create a new password.
              </p>

              <a
                href="${url}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                "
              >
                Reset Password
              </a>

              <p>
                If you did not request this, you can ignore this email.
              </p>
            </div>
          `,

          text: `Reset your Rooted BD password using this link: ${url}`,
        });

        if (error) {
          console.error("Password Reset Email Error:", error);
          throw new Error("Failed to send password reset email.");
        }

        console.log("Password Reset Email Sent:", data?.id);
      } catch (error) {
        console.error("Password Reset Email Failed:", error);
        throw error;
      }
    },
  },

  plugins: [
    // Admin Plugin
    adminPlugin({
      ac,
      roles: {
        admin,
        organizer,
        user,
      },
      defaultRole: "user",
    }),

    // JWT Plugin
    jwt({
      jwt: {
        issuer: authUrl,
        audience: authUrl,
        expirationTime: "1h",

        // Add user information and role to JWT payload
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        }),
      },
    }),
  ],
});

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // `void` = don't wait for the email to finish (see the timing note above)
      void sendEmail({
        to: user.email,
        subject: "Reset your Snapgram password",
        text: `We received a request to reset your password. Open this link to choose a new one (it expires in 1 hour):\n\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
        html: `<p>We received a request to reset your password.</p><p><a href="${url}">Choose a new password</a></p><p>This link expires in 1 hour. If you didn't ask for this, you can ignore this email.</p>`,
      });
    },
  },
  plugins: [nextCookies()],
});

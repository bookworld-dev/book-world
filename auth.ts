import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map((e) => e.trim()) ?? [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { scope: "openid email" },
      },
    }),
  ],
  pages: {
    error: "/auth-error",
  },
  callbacks: {
    signIn({ user }) {
      return allowedEmails.includes(user.email ?? "");
    },
  },
});

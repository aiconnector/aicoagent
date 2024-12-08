import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import AzureAD from "next-auth/providers/azure-ad"
import type { NextAuthConfig } from "next-auth"

export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL('/', nextUrl))
      }
      return isLoggedIn || isOnLoginPage
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

// Protect all routes except /login
export const authConfig = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
}

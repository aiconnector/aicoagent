"use client"

import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function Login() {
  const { status } = useSession()

  if (status === "authenticated") {
    return <p>You are already signed in.</p>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <div className="space-y-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow hover:bg-gray-100"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
          className="bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-700 rounded shadow hover:bg-blue-600"
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  )
}

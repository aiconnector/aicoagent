"use client"

import { useSession } from "next-auth/react"
import Main from "@/components/Main"
import Sidebar from "@/components/Sidebar"
import Link from 'next/link'

export default function Home() {
  const { status } = useSession()

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        Access Denied. Please <Link href="/login" className="text-blue-500 hover:underline ml-1">sign in</Link>.
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <Main />
    </div>
  )
}

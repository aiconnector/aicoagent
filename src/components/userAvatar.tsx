import Image from "next/image"
import { auth } from "@/app/auth"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      {session.user.image ? (
        <Image 
          src={session.user.image} 
          alt="User Avatar" 
          width={32} 
          height={32}
        />
      ) : (
        <div>No Avatar</div>
      )}
    </div>
  )
}

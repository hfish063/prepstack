import { useUser } from "@clerk/react"

export default function Welcome() {
  const { user } = useUser()

  const name =
    user?.username ?? user?.firstName ?? user?.primaryEmailAddress?.emailAddress

  return (
    <h1 className="text-2xl font-semibold">
      Welcome back{name ? `, ${name}` : ""}
    </h1>
  )
}

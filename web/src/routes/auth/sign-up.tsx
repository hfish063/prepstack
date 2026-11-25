import { SignUp } from "@clerk/react"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/sign-up")({
  beforeLoad: ({ context }) => {
    if (context.auth.isSignedIn) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp routing="hash" />
    </div>
  )
}

import { SignIn } from "@clerk/react"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/sign-in")({
  // Clerk reads redirect_url from the URL itself to return the user after sign-in
  validateSearch: (
    search: Record<string, unknown>
  ): { redirect_url?: string } => ({
    redirect_url:
      typeof search.redirect_url === "string" ? search.redirect_url : undefined,
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isSignedIn) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn routing="hash" />
    </div>
  )
}

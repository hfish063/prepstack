import { isUnauthorizedError } from "@/lib/api/errors"
import { useClerk } from "@clerk/react"
import { CircleExclamationPoint } from "lucide-react"
import { Button } from "../ui/button"

type DefaultErrorProps = {
  error: unknown
}

export default function DefaultError({ error }: DefaultErrorProps) {
  if (isUnauthorizedError(error)) {
    return <SessionExpired />
  }

  return (
    <div className="min-h-md flex size-full flex-col items-center justify-center gap-4 text-center">
      <CircleExclamationPoint className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        Sorry, something went wrong. Try again.
      </p>
    </div>
  )
}

function SessionExpired() {
  const { signOut } = useClerk()

  return (
    <div className="min-h-md flex size-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Session Expired</h1>
      <p className="text-muted-foreground">
        Your session has expired. You will be redirected to the Login page.
      </p>
      <Button onClick={() => signOut({ redirectUrl: "/auth/sign-in" })}>
        Log in
      </Button>
    </div>
  )
}

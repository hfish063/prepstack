import { Link } from "@tanstack/react-router"
import { buttonVariants } from "../ui/button"

type NotFoundProps = {
  message?: string
}

/**
 * Retrieves message from the data prop passed to defaultNotFoundComponent
 * in TanstackRouter route(s).
 *
 * Usage example: defaultNotFoundComponent({data}) =>
 * {const msg = getNotFoundMessage(data)...}
 *
 * @param data TanStackRouter NotFoundRouteProps data field.
 * @returns message string if it exists, or else undefined
 */
export function getNotFoundMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message
  }
}

export function NotFound({ message }: NotFoundProps) {
  return (
    <div className="flex size-full min-h-94 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">
        {message ? message : "The page cannot be found"}
      </p>
      <Link to="/dashboard" className={buttonVariants({ variant: "default" })}>
        Back to Dashboard
      </Link>
    </div>
  )
}

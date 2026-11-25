import { Link } from "@tanstack/react-router"
import { buttonVariants } from "../ui/button"

export default function NotFound() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-semibold">404</h1>
      <p>The page cannot be found</p>
      <Link to="/dashboard" className={buttonVariants({ variant: "default" })}>
        Back to Dashboard
      </Link>
    </div>
  )
}

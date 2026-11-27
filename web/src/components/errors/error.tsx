import { CircleExclamationPoint } from "lucide-react"

export default function DefaultError() {
  return (
    <div className="min-h-md flex size-full flex-col items-center justify-center gap-4 text-center">
      <CircleExclamationPoint className="size-12 text-muted-foreground" />
      <h1 className="text-4xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        Sorry, something went wrong. Try again.
      </p>
    </div>
  )
}

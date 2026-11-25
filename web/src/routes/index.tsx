import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div>
      <Button nativeButton={false} render={<Link to="/dashboard" />}>
        Get Started
      </Button>
    </div>
  )
}

import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="p-4">
      <Button nativeButton={false} render={<Link to="/dashboard" />}>
        Get Started
      </Button>
    </div>
  )
}

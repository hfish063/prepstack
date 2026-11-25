import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/interviews/$interviewId/$")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/interviews/$interviewId", params, replace: true })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/interviews/$interviewId/$"!</div>
}

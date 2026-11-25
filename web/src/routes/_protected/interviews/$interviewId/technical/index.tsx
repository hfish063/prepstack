import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/technical/"
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/interviews/$interviewId/technical/question",
      params: { interviewId: params.interviewId },
    })
  },
  component: RouteComponent,
})

function RouteComponent() {}

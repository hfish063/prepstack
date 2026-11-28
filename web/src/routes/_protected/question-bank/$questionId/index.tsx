import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/question-bank/$questionId/")({
  loader: ({ params }) => {
    throw redirect({ to: "/question-bank/$questionId/analyze", params })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/question-bank/$questionId/"!</div>
}

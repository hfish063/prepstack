import { Spinner } from "@/components/ui/spinner"
import CreateSavedQuestionDialog from "@/features/saved-questions/components/create-dialog"
import SavedQuestionList from "@/features/saved-questions/components/list"
import { getSavedQuestionsQueryOptions } from "@/features/saved-questions/hooks/use-saved-questions"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/question-bank/")({
  loader: ({ context }) =>
    context.queryClient.query(getSavedQuestionsQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-semibold">Question Bank</h1>
      <p className="text-muted-foreground">
        Load your previously saved AI-generated questions
      </p>
      <div className="flex justify-end">
        <CreateSavedQuestionDialog />
      </div>
      <Suspense fallback={<Spinner />}>
        <SavedQuestionList />
      </Suspense>
    </div>
  )
}

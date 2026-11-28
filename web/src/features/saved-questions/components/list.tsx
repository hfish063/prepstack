import { useSavedQuestions } from "../hooks/use-saved-questions"
import SavedQuestionCard from "./card"

export default function SavedQuestionList() {
  const { data: savedQuestions } = useSavedQuestions()

  return (
    <div className="flex flex-col gap-4">
      {savedQuestions.map((savedQuestion) => (
        <SavedQuestionCard
          key={savedQuestion.id}
          savedQuestion={savedQuestion}
        />
      ))}
    </div>
  )
}

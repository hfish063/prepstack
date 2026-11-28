import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { SavedQuestionRead } from "@/lib/api/generated"
import AnalyzeSavedQuestionButton from "./analyze-button"
import ManageSavedQuestionButton from "./manage-button"

type SavedQuestionCardProps = {
  savedQuestion: SavedQuestionRead
}

export default function SavedQuestionCard({
  savedQuestion,
}: SavedQuestionCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          {savedQuestion.content}
          <Badge>{savedQuestion.phaseType}</Badge>
          <p className="text-muted-foreground">
            {new Date(savedQuestion.createdAt).toLocaleDateString()} •{" "}
            {new Date(savedQuestion.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <AnalyzeSavedQuestionButton
            savedQuestionId={savedQuestion.id}
            isAnalyzed={savedQuestion.analysis != null}
          />
          <ManageSavedQuestionButton savedQuestion={savedQuestion} />
        </div>
      </CardContent>
    </Card>
  )
}

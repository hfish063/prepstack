import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SavedQuestionRead } from "@/lib/api/generated"
import { Sparkles } from "lucide-react"

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
        <Button variant={"outline"}>
          <Sparkles /> Analyze
        </Button>
      </CardContent>
    </Card>
  )
}

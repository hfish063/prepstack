import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { useSavedQuestions } from "@/features/saved-questions/hooks/use-saved-questions"
import type { SavedQuestionRead } from "@/lib/api/generated"
import { Bookmark } from "lucide-react"

type SavedQuestionTabProps = {
  isAdding: boolean
  onAdd: (text: string) => void
}

export default function SavedQuestionTab({
  isAdding,
  onAdd,
}: SavedQuestionTabProps) {
  const { data: savedQuestions } = useSavedQuestions()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedQuestion = savedQuestions.find(
    (savedQuestion) => savedQuestion.id === selectedId
  )

  if (savedQuestions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <Bookmark />
          </EmptyMedia>
          <EmptyTitle>No Saved Questions</EmptyTitle>
          <EmptyDescription>
            Questions you save will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="h-72">
        <ItemGroup role="radiogroup" aria-label="Saved questions">
          {savedQuestions.map((savedQuestion) => (
            <SavedQuestionItem
              key={savedQuestion.id}
              savedQuestion={savedQuestion}
              selected={savedQuestion.id === selectedId}
              disabled={isAdding}
              onSelect={() => setSelectedId(savedQuestion.id)}
            />
          ))}
        </ItemGroup>
      </ScrollArea>
      <Button
        disabled={!selectedQuestion || isAdding}
        onClick={() => selectedQuestion && onAdd(selectedQuestion.content)}
      >
        {isAdding ? <Spinner /> : "Add Question"}
      </Button>
    </div>
  )
}

type SavedQuestionItemProps = {
  savedQuestion: SavedQuestionRead
  selected: boolean
  disabled: boolean
  onSelect: () => void
}

function SavedQuestionItem({
  savedQuestion,
  selected,
  disabled,
  onSelect,
}: SavedQuestionItemProps) {
  return (
    <Item
      size="sm"
      variant={selected ? "outline" : "default"}
      className="cursor-pointer text-left hover:bg-muted/50 aria-checked:bg-muted"
      render={
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          disabled={disabled}
          onClick={onSelect}
        />
      }
    >
      <ItemContent>
        <ItemTitle className="line-clamp-2">{savedQuestion.content}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Badge variant={"outline"} className="capitalize">
          {savedQuestion.phaseType}
        </Badge>
      </ItemActions>
    </Item>
  )
}

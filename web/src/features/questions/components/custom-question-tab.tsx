import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

type CustomQuestionTabProps = {
  isAdding: boolean
  onAdd: (text: string) => void
}

export default function CustomQuestionTab({
  isAdding,
  onAdd,
}: CustomQuestionTabProps) {
  const [text, setText] = useState("")
  const trimmedText = text.trim()

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!trimmedText) return

    onAdd(trimmedText)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between gap-4"
    >
      <Field>
        <FieldLabel htmlFor="customQuestion">Question Prompt</FieldLabel>
        <Textarea
          id="customQuestion"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="(e.g. Describe a time you had to learn a new technology quickly.)"
          maxLength={500}
          className="min-h-32 resize-none"
          disabled={isAdding}
          required
        />
      </Field>
      <Button type="submit" disabled={!trimmedText || isAdding}>
        {isAdding ? <Spinner /> : "Add Question"}
      </Button>
    </form>
  )
}

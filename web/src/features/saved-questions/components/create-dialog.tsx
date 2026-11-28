import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { PhaseType } from "@/lib/api/generated"
import { Plus } from "lucide-react"
import { useSaveQuestion } from "../hooks/use-save-question"

const PHASE_OPTIONS: { value: PhaseType; label: string }[] = [
  { value: "behavioral", label: "Behavioral" },
  { value: "conceptual", label: "Conceptual" },
]

export default function CreateSavedQuestionDialog() {
  const [open, setOpen] = useState(false)

  const saveQuestion = useSaveQuestion({
    mutationConfig: {
      onSuccess: () => setOpen(false),
    },
  })

  const loading = saveQuestion.isPending

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    saveQuestion.mutate({
      body: {
        content: (form.get("content") as string).trim(),
        phaseType: form.get("phaseType") as PhaseType,
      },
    })
  }

  function handleOpenChange(next: boolean) {
    if (loading) return
    setOpen(next)
    if (!next) saveQuestion.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus /> New Question
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Question</DialogTitle>
          <DialogDescription>
            Fill out a few quick details and start practicing an interview
            question!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel id="phaseType-label">Question Type</FieldLabel>
              <Select
                name="phaseType"
                items={PHASE_OPTIONS}
                defaultValue={PHASE_OPTIONS[0].value}
                disabled={loading}
              >
                <SelectTrigger
                  aria-labelledby="phaseType-label"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="content">Question</FieldLabel>
              <Textarea
                id="content"
                name="content"
                placeholder="(e.g. Tell me about a time you resolved a conflict on your team.)"
                maxLength={500}
                required
                disabled={loading}
              />
            </Field>
          </FieldGroup>
          {saveQuestion.isError && (
            <p className="text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Create Question"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

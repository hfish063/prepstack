import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useCreateInterview } from "@/features/interviews/hooks/use-create-interview"

// Mirrors PhaseQuestionConfig bounds on the backend
const QUESTION_COUNT = { min: 1, max: 20, default: 5 }

export default function CreateInterviewDialog() {
  const [open, setOpen] = useState(false)

  const createInterview = useCreateInterview({
    mutationConfig: {
      onSuccess: () => setOpen(false),
    },
  })

  const loading = createInterview.isPending

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    createInterview.mutate({
      body: {
        role: form.get("role") as string,
        experienceLevel: form.get("experienceLevel") as string,
        topics: form.get("topics") as string,
        description: (form.get("description") as string) || undefined,
        questionCounts: {
          behavioral: Number(form.get("behavioralCount")),
          conceptual: Number(form.get("conceptualCount")),
        },
      },
    })
  }

  function handleOpenChange(next: boolean) {
    if (loading) return
    setOpen(next)
    if (!next) createInterview.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className={"w-fit"}>
            <Plus />
            Start Interview
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Interview Session</DialogTitle>
          <DialogDescription>
            Fill out a few quick details and start practicing for your next
            interview!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Target Role</FieldLabel>
              <Input
                name="role"
                placeholder="(e.g. Frontend Developer, Backend Developer)"
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel>Experience Level</FieldLabel>
              <Input
                name="experienceLevel"
                placeholder="(e.g. Beginner, Intermediate, Advanced)"
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel>Topics</FieldLabel>
              <Input
                name="topics"
                placeholder="(Comma-separated, e.g. React, Next.js, FastAPI)"
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                name="description"
                placeholder="(Optional, any notes for this session)"
                disabled={loading}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="behavioralCount">
                  Behavioral Questions
                </FieldLabel>
                <Input
                  id="behavioralCount"
                  name="behavioralCount"
                  type="number"
                  min={QUESTION_COUNT.min}
                  max={QUESTION_COUNT.max}
                  defaultValue={QUESTION_COUNT.default}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="conceptualCount">
                  Conceptual Questions
                </FieldLabel>
                <Input
                  id="conceptualCount"
                  name="conceptualCount"
                  type="number"
                  min={QUESTION_COUNT.min}
                  max={QUESTION_COUNT.max}
                  defaultValue={QUESTION_COUNT.default}
                  required
                  disabled={loading}
                />
              </Field>
            </div>
          </FieldGroup>
          {createInterview.isError && (
            <p className="text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Create Interview"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

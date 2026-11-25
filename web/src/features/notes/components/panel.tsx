import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useNotes } from "../hooks/use-notes"
import { useCreateNotes } from "../hooks/use-create-notes"
import { useDeleteNotes } from "../hooks/use-delete-notes"
import { useUpdateNotes } from "../hooks/use-update-notes"

const MAX_NOTE_CHARACTERS = 5000

type NotesPanelProps = {
  interviewId: number
}

export default function NotesPanel({ interviewId }: NotesPanelProps) {
  const { data: notes } = useNotes(interviewId)
  const createNotes = useCreateNotes({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Error saving notes. Please try again.",
        }),
    },
  })
  const deleteNotes = useDeleteNotes({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Error deleting notes. Please try again",
        }),
    },
  })
  const updateNotes = useUpdateNotes({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Error updating notes. Please try again",
        }),
    },
  })

  const [content, setContent] = useState(notes?.text ?? "")

  const savedContent = notes?.text ?? ""
  const hasExistingNotes = notes != null
  const hasDiff = content.trim() !== savedContent.trim()

  const characters = content.length
  const trimmedNotes = content.trim()
  const words = trimmedNotes.length > 0 ? trimmedNotes.split(/\s+/).length : 0

  const isSaving = createNotes.isPending || updateNotes.isPending
  const isDeleting = deleteNotes.isPending

  const handleSave = () => {
    // First-time note creation, hits (save) endpoint
    if (!hasExistingNotes) {
      createNotes.mutate({
        path: { interview_id: interviewId },
        body: { text: content },
      })
    } else {
      updateNotes.mutate({
        path: { interview_id: interviewId },
        body: { text: content },
      })
    }
  }

  const handleDelete = () => {
    if (!hasExistingNotes) return

    deleteNotes.mutate(
      { path: { interview_id: interviewId } },
      { onSuccess: () => setContent("") }
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex flex-row items-center justify-end gap-2">
        <Button
          className="w-16"
          disabled={
            trimmedNotes.length < 1 || isSaving || !hasDiff || isDeleting
          }
          onClick={handleSave}
        >
          {isSaving ? <Spinner /> : "Save"}
        </Button>
        <Button
          className="w-16"
          variant={"destructive"}
          disabled={!hasExistingNotes || isDeleting || isSaving}
          onClick={handleDelete}
        >
          {isDeleting ? <Spinner /> : "Clear"}
        </Button>
      </div>
      <Separator />
      <Textarea
        placeholder="Type your notes here."
        className="h-full"
        maxLength={MAX_NOTE_CHARACTERS}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">{`${characters} / ${MAX_NOTE_CHARACTERS} characters`}</p>
        <p className="text-sm text-muted-foreground">{`${words} words`}</p>
      </div>
    </div>
  )
}

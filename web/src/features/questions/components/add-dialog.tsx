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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { useAddQuestion } from "../hooks/use-add-question"
import CustomQuestionTab from "./custom-question-tab"
import SavedQuestionTab from "./saved-question-tab"

type AddQuestionDialogProps = {
  phaseId: number
}

export default function AddQuestionDialog({ phaseId }: AddQuestionDialogProps) {
  const [open, setOpen] = useState(false)

  const addQuestion = useAddQuestion({
    mutationConfig: {
      onSuccess: () => setOpen(false),
    },
  })

  const isAdding = addQuestion.isPending

  function handleAddQuestion(text: string) {
    addQuestion.mutate({ path: { phase_id: phaseId }, body: { text } })
  }

  function handleOpenChange(next: boolean) {
    if (isAdding) return
    setOpen(next)
    if (!next) addQuestion.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant={"outline"} className="w-full">
            <Plus /> Add Question
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Add another question to your current interview.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={"saved"} className="h-96">
          <TabsList className="w-full">
            <TabsTrigger value={"saved"} disabled={isAdding}>
              Saved Questions
            </TabsTrigger>
            <TabsTrigger value={"custom"} disabled={isAdding}>
              Custom Question
            </TabsTrigger>
          </TabsList>
          <TabsContent value={"saved"}>
            <SavedQuestionTab isAdding={isAdding} onAdd={handleAddQuestion} />
          </TabsContent>
          <TabsContent value={"custom"}>
            <CustomQuestionTab isAdding={isAdding} onAdd={handleAddQuestion} />
          </TabsContent>
        </Tabs>
        {addQuestion.isError && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

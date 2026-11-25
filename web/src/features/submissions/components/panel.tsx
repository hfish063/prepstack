import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { useSubmissions } from "../hooks/use-submissions"
import { useDeleteSubmissions } from "../hooks/use-delete-submissions"
import { toast } from "@/components/ui/toast"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { RotateCcwClock } from "lucide-react"

type SubmissionPanelProps = {
  phaseId: number
}

export default function SubmissionsPanel({ phaseId }: SubmissionPanelProps) {
  const { data: submissions } = useSubmissions(phaseId)

  const deleteSubmissions = useDeleteSubmissions({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Error clearing submissions. Please try again.",
        }),
    },
  })

  const isDeleting = deleteSubmissions.isPending

  const handleDelete = async () => {
    deleteSubmissions.mutate({ path: { phase_id: phaseId } })
  }

  if (submissions.length == 0) {
    return <EmptySubmissions />
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex w-full justify-end">
        <Button
          variant={"destructive"}
          className="w-28"
          disabled={isDeleting || submissions.length == 0}
          onClick={handleDelete}
        >
          {isDeleting ? <Spinner /> : "Clear History"}
        </Button>
      </div>
      <Separator />
      <Card className="w-full p-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission</TableHead>
                <TableHead>Language</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {submission.accepted ? (
                        <p className="font-semibold text-confirmation">
                          Accepted
                        </p>
                      ) : (
                        <p className="font-semibold text-destructive">Failed</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{submission.language.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  )
}

function EmptySubmissions() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <RotateCcwClock />
        </EmptyMedia>
        <EmptyTitle>No Submissions Yet</EmptyTitle>
        <EmptyDescription>
          You haven't submitted any code yet. Get started by typing in the
          editor panel.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

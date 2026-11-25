import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { ArrowLeft, RotateCcwClock } from "lucide-react"
import { Link, useParams } from "@tanstack/react-router"
import { Route } from "@/routes/_protected/interviews/$interviewId/technical/submissions"
import type { ProblemSubmissionHistoryRead } from "@/lib/api/generated"
import { cn } from "cn"
import CodeBlock from "@/components/layout/code-block"

type SubmissionsPanelProps = {
  phaseId: number
}

export default function SubmissionsPanel({ phaseId }: SubmissionsPanelProps) {
  const { data: submissions } = useSubmissions(phaseId)
  const { interviewId } = useParams({
    from: "/_protected/interviews/$interviewId",
  })
  const { submission } = Route.useSearch()

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

  if (submission !== undefined && submissions[submission]) {
    return <SubmissionPanel submission={submissions[submission]} />
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
                <TableHead>Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission, index) => (
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
                  <TableCell>
                    <Link
                      to="/interviews/$interviewId/technical/submissions"
                      params={{ interviewId }}
                      search={(prev) => ({ ...prev, submission: index })}
                      className={cn(buttonVariants({ variant: "link" }), "p-0")}
                    >
                      View
                    </Link>
                  </TableCell>
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

type SubmissionPanelProps = {
  submission: ProblemSubmissionHistoryRead
}

function SubmissionPanel({ submission }: SubmissionPanelProps) {
  const { interviewId } = useParams({
    from: "/_protected/interviews/$interviewId",
  })

  return (
    <div className="flex flex-col gap-4 p-6">
      <Link
        to="/interviews/$interviewId/technical/submissions"
        params={{ interviewId }}
        className={cn(
          buttonVariants({ variant: "link" }),
          "flex w-min flex-row gap-2 px-0"
        )}
      >
        <ArrowLeft />
        All Submissions
      </Link>
      <Separator />
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-row items-center gap-4">
          <h1
            className={cn(
              "text-2xl font-semibold",
              submission.accepted ? "text-confirmation" : "text-destructive"
            )}
          >
            {submission.accepted ? "Accepted" : "Failed"}
          </h1>
          <p className="text-muted-foreground">{`${submission.passedTestCases} / ${submission.totalTestCases} test cases`}</p>
        </div>
        <p className="text-muted-foreground">{`Code • ${submission.language.name}`}</p>
      </div>
      <CodeBlock
        code={submission.sourceCode}
        language={submission.language.name}
      />
    </div>
  )
}

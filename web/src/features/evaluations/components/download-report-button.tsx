import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { InterviewSummaryRead } from "@/lib/api/generated"
import { Download } from "lucide-react"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

type EvaluateReportButtonProps = {
  summary: InterviewSummaryRead
}

export default function EvaluateReportButton({
  summary,
}: EvaluateReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)

    try {
      const [{ pdf }, { default: EvaluationReport }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./evaluation-report"),
      ])

      const blob = await pdf(<EvaluationReport summary={summary} />).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "evaluation-report.pdf"
      link.click()

      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      toast.add({
        type: "error",
        description: "Error downloading report. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={"outline"}
            disabled={isGenerating}
            onClick={handleDownload}
          >
            {isGenerating ? <Spinner /> : <Download />}
            Export
          </Button>
        }
      />
      <TooltipContent>Export as PDF</TooltipContent>
    </Tooltip>
  )
}

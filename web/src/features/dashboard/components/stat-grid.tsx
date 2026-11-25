import {
  CircleCheck,
  Code,
  Lightbulb,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"
import { type ReactNode } from "react"
import StatCard from "./stat-card"
import type { DashboardSummaryRead } from "@/lib/api/generated"

type StatDefinition = {
  key: keyof DashboardSummaryRead
  label: string
  description: string | ((summary: DashboardSummaryRead) => string)
  icon: LucideIcon
  valueClassName?: string
}

const STATS: StatDefinition[] = [
  {
    key: "interviewsCompleted",
    label: "Interviews completed",
    description: ({ interviewsCreated }) =>
      `Out of ${interviewsCreated} mock interviews created`,
    icon: CircleCheck,
  },
  {
    key: "messagesSent",
    label: "Messages sent",
    description: "Responses given to interview questions",
    icon: MessageSquare,
  },
  {
    key: "hintsUsed",
    label: "Hints used",
    description: "Hints requested across all questions",
    icon: Lightbulb,
  },
  {
    key: "submissionsAccepted",
    label: "Submissions accepted",
    description: ({ totalSubmissions }) =>
      `Out of ${totalSubmissions} coding submissions`,
    icon: Code,
  },
]

type StatGridProps = {
  summary: DashboardSummaryRead
  children?: ReactNode
}

export default function StatGrid({ summary, children }: StatGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map(({ key, description, ...stat }) => (
        <StatCard
          key={key}
          value={summary[key]}
          description={
            typeof description === "function"
              ? description(summary)
              : description
          }
          {...stat}
        />
      ))}
      {children}
    </div>
  )
}

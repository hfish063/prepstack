import {
  CircleCheck,
  Code,
  Lightbulb,
  LucideIcon,
  MessageSquare,
} from "lucide-react";
import { ReactNode } from "react";
import { DashboardSummary } from "@/app/api/dashboard";
import StatCard from "./stat-card";

type StatDefinition = {
  key: keyof DashboardSummary;
  label: string;
  description: string | ((summary: DashboardSummary) => string);
  icon: LucideIcon;
  valueClassName?: string;
};

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
    valueClassName: "text-blue-500",
  },
  {
    key: "hintsUsed",
    label: "Hints used",
    description: "Hints requested across all questions",
    icon: Lightbulb,
    valueClassName: "text-yellow-500",
  },
  {
    key: "submissionsAccepted",
    label: "Submissions accepted",
    description: ({ totalSubmissions }) =>
      `Out of ${totalSubmissions} coding submissions`,
    icon: Code,
    valueClassName: "text-confirmation",
  },
];

type StatGridProps = {
  summary: DashboardSummary;
  children?: ReactNode;
};

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
  );
}

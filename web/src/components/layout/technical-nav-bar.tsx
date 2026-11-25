import { BookText, FileText, History } from "lucide-react"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { cn } from "cn"
import { Link, useLocation } from "@tanstack/react-router"

const TABS = [
  { segment: "question", label: "Question", icon: FileText },
  { segment: "submissions", label: "Submissions", icon: History },
  { segment: "notes", label: "Notes", icon: BookText },
]

type TechnicalPhaseNavBarProps = {
  interviewId: number
}

export default function TechnicalPhaseNavBar({
  interviewId,
}: TechnicalPhaseNavBarProps) {
  const location = useLocation()

  const currentPath = location.pathname

  const basePath = `/interviews/${interviewId}/technical`

  const activeTab = currentPath.replace(`${basePath}/`, "")

  return (
    <Tabs value={activeTab}>
      <TabsList variant={"line"}>
        {TABS.map((tab) => {
          const href = `${basePath}/${tab.segment}`
          const isActive = currentPath === href

          return (
            <Link
              key={tab.segment}
              to={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-4 py-4 font-semibold transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </Link>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

import InterviewGrid from "./grid"
import { LayoutGrid, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InterviewSessionRead, InterviewStatus } from "@/lib/api/generated"
import { getRouteApi } from "@tanstack/react-router"
import InterviewList from "./list"

const routeApi = getRouteApi("/_protected/interviews/")

const STATUS_TABS: { value: InterviewStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

type InterviewsViewProps = { interviews: InterviewSessionRead[] }

export default function InterviewsView({ interviews }: InterviewsViewProps) {
  const { view = "list", status = "all" } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const filteredInterviews =
    status === "all"
      ? interviews
      : interviews.filter((interview) => interview.status === status)

  function toggleView() {
    navigate({
      search: (prev) => ({ ...prev, view: view === "list" ? "grid" : "list" }),
    })
  }

  function changeStatus(value: unknown) {
    const tab = STATUS_TABS.find((tab) => tab.value === value)

    navigate({
      search: (prev) => ({
        ...prev,
        status: tab?.value === "all" ? undefined : tab?.value,
      }),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="text-lg font-semibold">Your Interviews</div>
        <div className="flex flex-row gap-4">
          <Tabs value={status} onValueChange={changeStatus}>
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tabs value={view} onValueChange={toggleView}>
            <TabsList>
              <TabsTrigger value={"list"}>
                <List />
              </TabsTrigger>
              <TabsTrigger value={"grid"}>
                <LayoutGrid />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      {view === "list" ? (
        <InterviewList interviews={filteredInterviews} />
      ) : (
        <InterviewGrid interviews={filteredInterviews} />
      )}
    </div>
  )
}

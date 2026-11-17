"use client";

import {
  InterviewSession,
  InterviewStatus,
} from "@/app/api/interview-sessions";
import InterviewGrid from "./grid";
import InterviewTable from "./table";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_TABS: { value: InterviewStatus; label: string }[] = [
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

type InterviewsViewProps = { interviews: InterviewSession[] };

export default function InterviewsView({ interviews }: InterviewsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listView = searchParams.get("view") === "list";
  const status =
    STATUS_TABS.find((tab) => tab.value === searchParams.get("status"))
      ?.value ?? "all";

  const filteredInterviews =
    status === "all"
      ? interviews
      : interviews.filter((interview) => interview.status === status);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const toggleView = () => updateParam("view", listView ? null : "list");

  const changeStatus = (value: string) =>
    updateParam("status", value === "all" ? null : value);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">Your Interviews</div>
        <div className="flex flex-row gap-4">
          <Tabs value={status} onValueChange={changeStatus}>
            <TabsList>
              <TabsTrigger value={"all"}>All</TabsTrigger>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button variant={"outline"} size={"icon"} onClick={toggleView}>
            {listView ? <Grid3X3 /> : <List />}
          </Button>
        </div>
      </div>
      {listView ? (
        <InterviewTable interviews={filteredInterviews} />
      ) : (
        <InterviewGrid interviews={filteredInterviews} />
      )}
    </div>
  );
}

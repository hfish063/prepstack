"use client";

import { InterviewSession } from "@/app/api/interview-sessions";
import CreateInterviewDialog from "./create-dialog";
import InterviewGrid from "./grid";
import InterviewTable from "./table";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type InterviewsViewProps = { interviews: InterviewSession[] };

export default function InterviewsView({ interviews }: InterviewsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listView = searchParams.get("view") === "list";

  const toggleView = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (listView) {
      params.delete("view");
    } else {
      params.set("view", "list");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center gap-4">
        <CreateInterviewDialog />
        <Button variant={"outline"} size={"icon"} onClick={toggleView}>
          {listView ? <Grid3X3 /> : <List />}
        </Button>
      </div>
      {listView ? (
        <InterviewTable interviews={interviews} />
      ) : (
        <InterviewGrid interviews={interviews} />
      )}
    </div>
  );
}

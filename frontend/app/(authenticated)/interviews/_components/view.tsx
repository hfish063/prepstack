"use client";

import { InterviewSession } from "@/app/api/interview-sessions";
import CreateInterviewDialog from "./create-dialog";
import InterviewGrid from "./grid";
import InterviewTable from "./table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

type InterviewsViewProps = { interviews: InterviewSession[] };

export default function InterviewsView({ interviews }: InterviewsViewProps) {
  const [listView, setListView] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center gap-4">
        <CreateInterviewDialog />
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setListView(!listView)}
        >
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

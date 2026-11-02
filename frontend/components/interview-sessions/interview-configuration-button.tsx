import { InterviewSession } from "@/app/api/interview-sessions";
import { Button } from "../ui/button";
import { Ellipsis, EllipsisVertical } from "lucide-react";

type InterviewConfigurationButtonProps = {
  interview: InterviewSession;
};

export default function InterviewConfigurationButton({
  interview,
}: InterviewConfigurationButtonProps) {
  return (
    <Button variant={"ghost"} size={"icon"}>
      <EllipsisVertical />
    </Button>
  );
}

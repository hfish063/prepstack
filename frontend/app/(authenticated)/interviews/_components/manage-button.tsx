import { InterviewSession } from "@/app/api/interview-sessions";
import { EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { Spinner } from "../../../../components/ui/spinner";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { useInterviews } from "@/hooks/use-interviews";

type ManageInterviewButtonProps = {
  interview: InterviewSession;
};

export default function ManageInterviewButton({
  interview,
}: ManageInterviewButtonProps) {
  const { deleteInterview } = useInterviews();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteInterview(interview.id);

      router.refresh();
    } catch {
      console.error(
        `Error deleting interview session with id: ${interview.id}`,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={"ghost"} size={"icon"} disabled={isDeleting}>
            <EllipsisVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash />
          {isDeleting ? <Spinner /> : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

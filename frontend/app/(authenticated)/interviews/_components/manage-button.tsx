import {
  deleteInterviewByIdForUser,
  InterviewSession,
} from "@/app/api/interview-sessions";
import { useAuth } from "@clerk/nextjs";
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

type ManageInterviewButtonProps = {
  interview: InterviewSession;
};

export default function ManageInterviewButton({
  interview,
}: ManageInterviewButtonProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");

      await deleteInterviewByIdForUser(token, interview.id);

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

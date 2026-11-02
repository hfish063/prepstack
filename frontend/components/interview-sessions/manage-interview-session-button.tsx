"use client";

import {
  deleteInterviewByIdForUser,
  InterviewSession,
} from "@/app/api/interview-sessions";
import { Button } from "../ui/button";
import { EllipsisVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type ManageInterviewSessionButtonProps = {
  interview: InterviewSession;
};

export default function ManageInterviewSessionButton({
  interview,
}: ManageInterviewSessionButtonProps) {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const token = await getToken();
      if (!token) throw Error("Unauthorized");

      await deleteInterviewByIdForUser(token, interview.id);

      router.push("/interviews");
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
          <Button variant={"ghost"} size={"icon"}>
            <EllipsisVertical />
          </Button>
        }
      ></DropdownMenuTrigger>
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

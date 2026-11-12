"use client";

import {
  deleteInterviewByIdForUser,
  InterviewSession,
} from "@/app/api/interview-sessions";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setConfirmOpen(false);
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
    <>
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
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
          >
            <Trash />
            {isDeleting ? <Spinner /> : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete interview session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this interview session, along with
              all of its phases and messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

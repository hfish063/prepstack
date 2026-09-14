"use client";

import {
  deleteInterviewByIdForUser,
  InterviewSession,
} from "@/app/api/interview-sessions";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EllipsisVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type InterviewCardProps = {
  interview: InterviewSession;
};

export default function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <Card key={interview.id} className="relative">
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href={`/interviews/${interview.id}`}
            className="after:absolute after:inset-0"
          >
            <CardTitle>{interview.role}</CardTitle>
          </Link>
          <CardDescription>{interview.topics}</CardDescription>
        </div>
        <div className="relative z-10">
          <ManageInterviewButton interview={interview} />
        </div>
      </CardHeader>
    </Card>
  );
}

type ManageInterviewButtonProps = {
  interview: InterviewSession;
};

function ManageInterviewButton({ interview }: ManageInterviewButtonProps) {
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

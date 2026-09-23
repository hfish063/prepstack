"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { saveInterview } from "@/app/api/interview-sessions";

export default function CreateInterviewDialog() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthenticated");

      await saveInterview(token, {
        role: form.get("role") as string,
        experienceLevel: form.get("experienceLevel") as string,
        topics: form.get("topics") as string,
        description: (form.get("description") as string) || undefined,
      });

      router.refresh();
      setOpen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (loading) return;
    setOpen(next);
    if (!next) setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className={"w-fit"}>
            <Plus />
            Start Interview
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Interview Session</DialogTitle>
          <DialogDescription>
            Fill out a few quick details and start practicing for your next
            interview!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Target Role</FieldLabel>
              <Input
                name="role"
                placeholder="(e.g. Frontend Developer, Backend Developer)"
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel>Experience Level</FieldLabel>
              <Input
                name="experienceLevel"
                placeholder="(e.g. Beginner, Intermediate, Advanced)"
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel>Topics</FieldLabel>
              <Input
                name="topics"
                placeholder="(Comma-separated, e.g. React, Next.js, FastAPI)"
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                name="description"
                placeholder="(Optional, any notes for this session)"
                disabled={loading}
              />
            </Field>
          </FieldGroup>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Create Interview"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

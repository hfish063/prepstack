"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  deleteNotesForInterview,
  findNotesForInterview,
  saveNotesForInterview,
  updateNotesForInterview,
} from "@/app/api/interview-session-notes";

const MAX_NOTE_CHARACTERS = 5000;

type NotesPanelProps = {
  interviewId: number;
};

export default function NotesPanel({ interviewId }: NotesPanelProps) {
  const { getToken } = useAuth();

  const [notes, setNotes] = useState<string | null>(null);
  const [hasExistingNotes, setHasExistingNotes] = useState(false);
  const [hasDiff, setHasDiff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const characters = notes?.length ?? 0;
  const trimmedNotes = notes?.trim() ?? "";
  const words = trimmedNotes.length > 0 ? trimmedNotes.split(/\s+/).length : 0;

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadNotes = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const existingNotes = await findNotesForInterview(token, interviewId);
        if (isCancelled) return;

        setNotes(existingNotes?.text ?? null);
        setHasExistingNotes(existingNotes != null);
      } catch {
        console.error("Failed to fetch interview notes.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadNotes();

    return () => {
      isCancelled = true;
    };
  }, [interviewId, getToken]);

  const handleSave = async () => {
    if (notes == null) return;

    const token = await getToken();
    if (!token) return;

    setIsSaving(true);

    try {
      // First-time note creation, hits (save) endpoint
      if (!hasExistingNotes) {
        await saveNotesForInterview(token, interviewId, { text: notes });
        setHasExistingNotes(true);
        setHasDiff(false);
      } else {
        await updateNotesForInterview(token, interviewId, { text: notes });
        setHasDiff(false);
      }
    } catch {
      console.error("Failed to save interview notes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (notes == null) return;

    const token = await getToken();
    if (!token) return;

    setIsDeleting(true);

    try {
      await deleteNotesForInterview(token, interviewId);
      setHasExistingNotes(false);
      setNotes(null);
    } catch {
      console.error("Failed to delete interview notes.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 gap-4 h-full">
      <div className="flex flex-row gap-2 justify-end items-center">
        <Button
          className="w-16"
          disabled={notes == null || notes.length < 1 || isSaving || !hasDiff}
          onClick={handleSave}
        >
          {isSaving ? <Spinner /> : "Save"}
        </Button>
        <Button
          className="w-16"
          variant={"destructive"}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? <Spinner /> : "Clear"}
        </Button>
      </div>
      <Separator />
      <Textarea
        placeholder="Type your notes here."
        className="h-full"
        value={notes ?? ""}
        onChange={(e) => {
          if (e.target.value.length > MAX_NOTE_CHARACTERS) {
            return;
          } else if (e.target.value.trim() != notes?.trim()) {
            setHasDiff(true);
          }

          setNotes(e.target.value);
        }}
      />
      <div className="flex flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">{`${characters} / ${MAX_NOTE_CHARACTERS} characters`}</p>
        <p className="text-sm text-muted-foreground">{`${words} words`}</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { InterviewSessionNotes } from "@/app/api/interview-session-notes";
import { useNotes } from "@/hooks/use-notes";

const MAX_NOTE_CHARACTERS = 5000;

type NotesPanelProps = {
  interviewId: number;
  notes: InterviewSessionNotes | null;
};

export default function NotesPanel({ interviewId, notes }: NotesPanelProps) {
  const { deleteNotes, saveNotes, updateNotes } = useNotes();

  const [content, setContent] = useState<string | null>(notes?.text ?? null);
  const [hasExistingNotes, setHasExistingNotes] = useState(false);
  const [hasDiff, setHasDiff] = useState(false);
  const characters = content?.length ?? 0;
  const trimmedNotes = content?.trim() ?? "";
  const words = trimmedNotes.length > 0 ? trimmedNotes.split(/\s+/).length : 0;

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (content == null) return;

    setIsSaving(true);

    try {
      // First-time note creation, hits (save) endpoint
      if (!hasExistingNotes) {
        await saveNotes(interviewId, { text: content });
        setHasExistingNotes(true);
        setHasDiff(false);
      } else {
        await updateNotes(interviewId, { text: content });
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

    setIsDeleting(true);

    try {
      await deleteNotes(interviewId);
      setHasExistingNotes(false);
      setContent(null);
    } catch {
      console.error("Failed to delete interview notes.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-4 h-full">
      <div className="flex flex-row gap-2 justify-end items-center">
        <Button
          className="w-16"
          disabled={
            content == null || content.length < 1 || isSaving || !hasDiff
          }
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
        value={content ?? ""}
        onChange={(e) => {
          if (e.target.value.length > MAX_NOTE_CHARACTERS) {
            return;
          } else if (e.target.value.trim() != content?.trim()) {
            setHasDiff(true);
          }

          setContent(e.target.value);
        }}
      />
      <div className="flex flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">{`${characters} / ${MAX_NOTE_CHARACTERS} characters`}</p>
        <p className="text-sm text-muted-foreground">{`${words} words`}</p>
      </div>
    </div>
  );
}

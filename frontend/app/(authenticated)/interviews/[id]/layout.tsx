import { auth } from "@clerk/nextjs/server";
import { findInterviewById } from "@/app/api/interview-sessions";
import { findPhasesForInterview } from "@/app/api/interview-phases";
import InterviewPhaseIndicators from "./_components/phase-indicators";
import CompleteInterviewButton from "./_components/complete-button";
import ManageInterviewSessionButton from "./_components/manage-session-button";
import { Separator } from "@/components/ui/separator";

export default async function InterviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  await auth.protect();

  const { id } = await params;
  const interviewId = Number(id);

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return null;
  }

  const [interview, phases] = await Promise.all([
    findInterviewById(token, interviewId),
    findPhasesForInterview(token, interviewId),
  ]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-row justify-between gap-2">
        <div>
          <h1 className="text-lg font-medium">{interview.role}</h1>
          <p className="text-sm text-muted-foreground">
            {interview.experienceLevel}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <InterviewPhaseIndicators phases={phases} />
          </div>
          <div className="flex flex-row gap-2">
            <CompleteInterviewButton interview={interview} />
            <ManageInterviewSessionButton interview={interview} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

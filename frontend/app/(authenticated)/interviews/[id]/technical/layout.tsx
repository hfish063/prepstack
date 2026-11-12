import {
  findCodingProblemForPhase,
  findLanguageTemplateForPhase,
} from "@/app/api/coding-problems";
import { findPhasesForInterview } from "@/app/api/interview-phases";
import EditorPanel from "@/components/interviews/editor-panel";
import TechnicalPhaseNavBar from "./_components/nav-bar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PREFERRED_LANGUAGE_NAME = "Python";

export default async function TechnicalPhaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  const { getToken } = await auth();
  const token = await getToken();
  if (!token) return;

  const phases = await findPhasesForInterview(token, interviewId);
  const currentPhase = phases.find((phase) => phase.status === "in_progress");

  if (!currentPhase) {
    return (
      <p className="text-sm text-muted-foreground">
        This interview has already been completed and is set to read-only mode.
      </p>
    );
  }

  if (currentPhase.phaseType !== "technical") {
    redirect(`/interviews/${interviewId}/${currentPhase.phaseType}`);
  }

  const codingProblem = await findCodingProblemForPhase(token, currentPhase.id);
  const preferredLanguage =
    codingProblem.languages.find(
      (language) => language.name === PREFERRED_LANGUAGE_NAME,
    ) ?? codingProblem.languages[0];
  const languageTemplate = await findLanguageTemplateForPhase(
    token,
    currentPhase.id,
    preferredLanguage.id,
  );

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <Card className="h-full gap-0 p-0">
            <CardHeader className="px-6 py-2">
              <TechnicalPhaseNavBar interviewId={interviewId} />
            </CardHeader>
            <Separator />
            <CardContent className="h-full min-h-0 flex-1 p-0">
              {children}
            </CardContent>
          </Card>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <EditorPanel
            phaseId={currentPhase.id}
            language={preferredLanguage}
            starterCode={languageTemplate.starterCode}
            examples={codingProblem.examples}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

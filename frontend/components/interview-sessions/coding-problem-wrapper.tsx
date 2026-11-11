import {
  CodingProblem,
  ProblemLanguageTemplate,
  ProgrammingLanguage,
} from "@/app/api/coding-problems";
import EditorPanel from "./editor-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import CodingProblemTabs from "./coding-problem-tabs";

type CodingProblemWrapperProps = {
  interviewId: number;
  phaseId: number;
  codingProblem: CodingProblem;
  languageTemplate: ProblemLanguageTemplate;
  preferredLanguage: ProgrammingLanguage;
};

export default function CodingProblemWrapper({
  interviewId,
  phaseId,
  codingProblem,
  languageTemplate,
  preferredLanguage,
}: CodingProblemWrapperProps) {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <CodingProblemTabs
            interviewId={interviewId}
            phaseId={phaseId}
            codingProblem={codingProblem}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <EditorPanel
            phaseId={phaseId}
            language={preferredLanguage}
            starterCode={languageTemplate.starterCode}
            examples={codingProblem.examples}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

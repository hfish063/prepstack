import {
  CodingProblem,
  ProblemLanguageTemplate,
  ProgrammingLanguage,
} from "@/app/api/coding-problems";
import ProblemPanel from "./problem-panel";
import EditorPanel from "./editor-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

type CodingProblemWrapperProps = {
  phaseId: number;
  codingProblem: CodingProblem;
  languageTemplate: ProblemLanguageTemplate;
  preferredLanguage: ProgrammingLanguage;
};

export default function CodingProblemWrapper({
  phaseId,
  codingProblem,
  languageTemplate,
  preferredLanguage,
}: CodingProblemWrapperProps) {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <ProblemPanel codingProblem={codingProblem} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <EditorPanel
            phaseId={phaseId}
            language={preferredLanguage}
            starterCode={languageTemplate.starterCode}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

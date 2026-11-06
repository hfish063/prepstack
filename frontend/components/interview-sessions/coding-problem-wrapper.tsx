import {
  CodingProblem,
  ProblemLanguageTemplate,
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
};

export default function CodingProblemWrapper({
  phaseId,
  codingProblem,
  languageTemplate,
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
            language="python"
            starterCode={languageTemplate.starterCode}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

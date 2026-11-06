import {
  CodingProblem,
  ProblemLanguageTemplate,
} from "@/app/api/coding-problems";
import ProblemPanel from "./problem-panel";
import EditorPanel from "./editor-panel";

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
    <div className="flex flex-row gap-4 h-full min-h-0">
      <div className="w-[50%] min-w-0 h-full min-h-0">
        <ProblemPanel codingProblem={codingProblem} />
      </div>

      <div className="w-[50%] min-w-0 h-full min-h-0">
        <EditorPanel
          language="python"
          starterCode={languageTemplate.starterCode}
        />
      </div>
    </div>
  );
}

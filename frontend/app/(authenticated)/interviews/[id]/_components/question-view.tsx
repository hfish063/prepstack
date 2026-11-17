import { InterviewQuestion } from "@/app/api/questions";
import QuestionMenu from "./question-menu";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuestionViewProps = {
  activeQuestion: InterviewQuestion;
  questions: InterviewQuestion[];
  children: React.ReactNode;
};

export default function QuestionView({
  activeQuestion,
  questions,
  children,
}: QuestionViewProps) {
  return (
    <div className="flex flex-row h-full min-h-0 gap-4">
      <div className="w-56 shrink-0 lg:w-72 xl:w-80 2xl:w-96">
        <QuestionMenu
          questions={questions}
          activeQuestionId={activeQuestion.id}
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
            <CardDescription>{activeQuestion.text}</CardDescription>
          </CardHeader>
        </Card>
        {children}
      </div>
    </div>
  );
}

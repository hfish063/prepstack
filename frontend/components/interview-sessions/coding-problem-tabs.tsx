import { CodingProblem } from "@/app/api/coding-problems";
import { Card, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import QuestionPanel from "./question-panel";
import NotesPanel from "./notes-panel";
import { BookText, FileText } from "lucide-react";

type CodingProblemTabsProps = {
  interviewId: number;
  codingProblem: CodingProblem;
};

export default function CodingProblemTabs({
  interviewId,
  codingProblem,
}: CodingProblemTabsProps) {
  return (
    <Card className="h-full gap-0 p-0">
      <Tabs defaultValue="question" className="h-full min-h-0 gap-0">
        <CardHeader className="px-6 py-2">
          <TabsList variant="line">
            <TabsTrigger value="question">
              <div className="flex flex-row items-center gap-2 font-semibold">
                <FileText />
                Question
              </div>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <div className="flex flex-row items-center gap-2 font-semibold">
                <BookText />
                Notes
              </div>
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <Separator />
        <TabsContent value="question" className="min-h-0 flex-1">
          <QuestionPanel codingProblem={codingProblem} />
        </TabsContent>
        <TabsContent value="notes" className="min-h-0 flex-1 p-6">
          <NotesPanel interviewId={interviewId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

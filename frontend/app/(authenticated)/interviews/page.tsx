import { findAllInterviewsForUser } from "@/app/api/interview-sessions";
import InterviewsView from "./_components/view";
import { getServerAuthToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import CreateInterviewDialog from "./_components/create-dialog";
import { Bot } from "lucide-react";

export default async function Interviews() {
  const token = await getServerAuthToken();

  const interviews = await findAllInterviewsForUser(token);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-4xl font-semibold">Interviews</div>
      <p className="text-muted-foreground">
        Practice with AI-powered interviews tailored to your goals.
      </p>
      <Card>
        <CardContent className="flex flex-row gap-4 items-center justify-between">
          <div className="flex flex-row gap-4 items-center">
            <Bot size={36} />
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-semibold">Ready to practice?</div>
              <p className="text-muted-foreground">
                Start a new interview to get personalized questions, real-time
                feedback, and improve your skills.
              </p>
            </div>
          </div>
          <CreateInterviewDialog />
        </CardContent>
      </Card>
      <InterviewsView interviews={interviews} />
    </div>
  );
}

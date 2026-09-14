import { InterviewSession } from "@/app/api/interview-sessions";
import InterviewCard from "./interview-card";

type InterviewListProps = {
  interviews: InterviewSession[];
};

export default function InterviewList({ interviews }: InterviewListProps) {
  return (
    <div className="flex flex-col gap-4">
      {interviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} />
      ))}
    </div>
  );
}

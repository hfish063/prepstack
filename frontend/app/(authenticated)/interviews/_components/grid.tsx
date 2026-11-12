import { InterviewSession } from "@/app/api/interview-sessions";
import InterviewCard from "@/app/(authenticated)/interviews/_components/card";

type InterviewGridProps = {
  interviews: InterviewSession[];
};

export default function InterviewGrid({ interviews }: InterviewGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} />
      ))}
    </div>
  );
}

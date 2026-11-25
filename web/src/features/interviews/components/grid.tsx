import type { InterviewSessionRead } from "@/lib/api/generated"
import InterviewCard from "./card"

type InterviewGridProps = {
  interviews: InterviewSessionRead[]
}

export default function InterviewGrid({ interviews }: InterviewGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} />
      ))}
    </div>
  )
}

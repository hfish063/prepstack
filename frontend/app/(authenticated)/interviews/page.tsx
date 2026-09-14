import { findAllInterviewsForUser } from "@/app/api/interview-sessions";
import CreateInterviewDialog from "@/components/interviews/create-interview-dialog";
import InterviewList from "@/components/interviews/interview-list";
import { auth } from "@clerk/nextjs/server";

export default async function Interviews() {
  await auth.protect();

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return;
  }

  const interviews = await findAllInterviewsForUser(token);

  return (
    <div className="flex flex-col gap-4">
      <CreateInterviewDialog />
      <InterviewList interviews={interviews} />
    </div>
  );
}

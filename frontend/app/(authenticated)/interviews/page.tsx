import { findAllInterviewsForUser } from "@/app/api/interview-sessions";
import { auth } from "@clerk/nextjs/server";
import InterviewsView from "./_components/view";

export default async function Interviews() {
  await auth.protect();

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return;
  }

  const interviews = await findAllInterviewsForUser(token);

  return <InterviewsView interviews={interviews} />;
}

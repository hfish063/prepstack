import { findAllInterviewsForUser } from "@/app/api/interview-sessions";
import InterviewsView from "./_components/view";
import { getServerAuthToken } from "@/lib/auth";

export default async function Interviews() {
  const token = await getServerAuthToken();

  const interviews = await findAllInterviewsForUser(token);

  return <InterviewsView interviews={interviews} />;
}

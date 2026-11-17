import { findDashboardSummary } from "@/app/api/dashboard";
import { getServerAuthToken } from "@/lib/auth";
import StatGrid from "./_components/stat-grid";
import { currentUser } from "@clerk/nextjs/server";
import CreateInterviewDialog from "../interviews/_components/create-dialog";
import { findAllInterviewsForUser } from "@/app/api/interview-sessions";
import RecentInterviewsList from "./_components/recent-interviews-list";import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Play } from "lucide-react";

const RECENT_INTERVIEWS_LIMIT = 5;

export default async function DashboardPage() {
  const user = await currentUser();

  const token = await getServerAuthToken();

  const [summary, recentInterviews, [lastInterview]] = await Promise.all([
    findDashboardSummary(token),
    findAllInterviewsForUser(token, undefined, RECENT_INTERVIEWS_LIMIT),
    findAllInterviewsForUser(token, "in_progress", 1),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {user?.firstName && (
          <div className="text-3xl font-semibold">
            Welcome back, {user?.firstName}!
          </div>
        )}
        <div className="flex flex-row gap-4">
          {lastInterview && (
            <Link
              href={`/interviews/${lastInterview.id}`}
              className={buttonVariants({ variant: "confirmation" })}
            >
              <Play /> Resume
            </Link>
          )}

          <CreateInterviewDialog />
        </div>
      </div>
      <StatGrid summary={summary}>
        <RecentInterviewsList recentInterviews={recentInterviews} />      </StatGrid>
    </div>
  );
}

import { findDashboardSummary } from "@/app/api/dashboard";
import { getServerAuthToken } from "@/lib/auth";
import StatGrid from "./_components/stat-grid";
import { currentUser } from "@clerk/nextjs/server";
import CreateInterviewDialog from "../interviews/_components/create-dialog";

export default async function DashboardPage() {
  const user = await currentUser();

  const token = await getServerAuthToken();

  const summary = await findDashboardSummary(token);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {user?.firstName && (
          <div className="text-3xl font-semibold">
            Welcome back, {user?.firstName}!
          </div>
        )}
        <CreateInterviewDialog />
      </div>
      <StatGrid summary={summary} />
    </div>
  );
}

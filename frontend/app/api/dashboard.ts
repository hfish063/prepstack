import apiFetch from "./api";

export interface DashboardSummary {
  interviewsCreated: number;
  interviewsCompleted: number;
  messagesSent: number;
  hintsUsed: number;
  submissionsAccepted: number;
  totalSubmissions: number;
}

export async function findDashboardSummary(token: string) {
  const response = await apiFetch("/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard summary.");
  }

  return (await response.json()) as DashboardSummary;
}

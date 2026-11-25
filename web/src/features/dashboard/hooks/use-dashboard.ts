import { getDashboardSummaryApiDashboardGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getDashboardQueryOptions() {
  return queryOptions(getDashboardSummaryApiDashboardGetOptions())
}

export function useDashboard() {
  return useSuspenseQuery(getDashboardQueryOptions())
}

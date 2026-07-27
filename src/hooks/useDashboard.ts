import { useQuery } from '@tanstack/react-query';
import { fetchOverviewMetrics } from '../lib/api/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: fetchOverviewMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

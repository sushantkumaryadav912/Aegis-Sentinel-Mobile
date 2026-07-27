import { useQuery } from '@tanstack/react-query';
import { fetchLogs, LogFilterParams } from '../lib/api/logs';

export function useLogs(params: LogFilterParams = {}) {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => fetchLogs(params),
  });
}

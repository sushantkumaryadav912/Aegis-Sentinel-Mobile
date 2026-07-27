import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlerts, fetchAlertById, updateAlertStatus, AlertFilterParams } from '../lib/api/alerts';
import { AlertStatus } from '../lib/types';

export function useAlerts(params: AlertFilterParams = {}) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => fetchAlerts(params),
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: () => fetchAlertById(id),
    enabled: !!id,
  });
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AlertStatus }) => updateAlertStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

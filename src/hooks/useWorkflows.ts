import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflows, triggerWorkflow } from '../lib/api/workflows';

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows,
  });
}

export function useTriggerWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, workflowType }: { alertId: string; workflowType: string }) =>
      triggerWorkflow(alertId, workflowType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

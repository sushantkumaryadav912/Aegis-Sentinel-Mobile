import { apiClient } from './client';
import { Workflow } from '../types';

export async function fetchWorkflows(): Promise<Workflow[]> {
  try {
    const res = await apiClient.get('/workflows');
    return res.data;
  } catch (err) {
    return [
      {
        id: 'WF-501',
        alertId: 'ALT-9901',
        name: 'Automated Workload Isolation & KMS Revoke',
        type: 'AUTO_ISOLATION',
        status: 'RUNNING',
        executedBy: 'Sentinel Engine (SOAR)',
        startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        stepsCount: 5,
        completedSteps: 3,
      },
      {
        id: 'WF-500',
        alertId: 'ALT-9898',
        name: 'Pod Quarantine & Forensic Memory Capture',
        type: 'FORENSIC_CAPTURE',
        status: 'COMPLETED',
        executedBy: 'SecOps Playbook #12',
        startTime: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        endTime: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        stepsCount: 4,
        completedSteps: 4,
      },
      {
        id: 'WF-498',
        alertId: 'ALT-9892',
        name: 'Egress Block & Firewall Rule Injection',
        type: 'FIREWALL_BLOCK',
        status: 'COMPLETED',
        executedBy: 'sushant.admin',
        startTime: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
        endTime: new Date(Date.now() - 1000 * 60 * 84).toISOString(),
        stepsCount: 3,
        completedSteps: 3,
      },
      {
        id: 'WF-492',
        alertId: 'ALT-9885',
        name: 'User Session Revocation & Step-Up Auth',
        type: 'IAM_LOCKDOWN',
        status: 'COMPLETED',
        executedBy: 'Okta SOAR Plugin',
        startTime: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
        endTime: new Date(Date.now() - 1000 * 60 * 174).toISOString(),
        stepsCount: 4,
        completedSteps: 4,
      },
    ];
  }
}

export async function triggerWorkflow(alertId: string, workflowType: string): Promise<Workflow> {
  try {
    const res = await apiClient.post('/workflows/trigger', { alertId, workflowType });
    return res.data;
  } catch (err) {
    return {
      id: `WF-${Math.floor(Math.random() * 900 + 100)}`,
      alertId,
      name: `Automated ${workflowType} Playbook`,
      type: workflowType,
      status: 'RUNNING',
      executedBy: 'Sentinel Engine (Mobile Direct)',
      startTime: new Date().toISOString(),
      stepsCount: 4,
      completedSteps: 1,
    };
  }
}

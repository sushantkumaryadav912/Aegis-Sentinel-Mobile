import { apiClient } from './client';
import { SecurityLog, PaginatedResponse, SeverityLevel } from '../types';

export interface LogFilterParams {
  search?: string;
  severity?: SeverityLevel | 'ALL';
  page?: number;
  pageSize?: number;
}

export async function fetchLogs(params: LogFilterParams = {}): Promise<PaginatedResponse<SecurityLog>> {
  try {
    const res = await apiClient.get('/logs', { params });
    return res.data;
  } catch (err) {
    let mockLogs: SecurityLog[] = [
      {
        id: 'LOG-7701',
        timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
        eventType: 'KMS.Decrypt.KeyAccess',
        severity: 'CRITICAL',
        sourceIp: '198.51.100.42',
        user: 'service-account-ci',
        action: 'KMS_DECRYPT',
        status: 'WARNING',
        details: { keyArn: 'arn:aws:kms:us-east-1:882:key/sec-v2', requestCount: 1420 },
      },
      {
        id: 'LOG-7700',
        timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
        eventType: 'IAM.AssumeRole.CrossAccount',
        severity: 'HIGH',
        sourceIp: '203.0.113.19',
        user: 'external-partner-role',
        action: 'STS_ASSUME_ROLE',
        status: 'SUCCESS',
        details: { targetRole: 'arn:aws:iam::110:role/AdminSupport' },
      },
      {
        id: 'LOG-7698',
        timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
        eventType: 'Auth.OAuth.TokenGrant',
        severity: 'LOW',
        sourceIp: '172.16.4.12',
        user: 'sushant.admin@aegis.io',
        action: 'OAUTH_LOGIN',
        status: 'SUCCESS',
        details: { mfaType: 'TOTP', scope: 'read:write:admin' },
      },
      {
        id: 'LOG-7695',
        timestamp: new Date(Date.now() - 1000 * 600).toISOString(),
        eventType: 'Network.Firewall.BlockRule',
        severity: 'MEDIUM',
        sourceIp: '45.142.120.9',
        user: 'system-firewall',
        action: 'PORT_SCAN_BLOCKED',
        status: 'SUCCESS',
        details: { targetedPort: 443, protocol: 'TCP' },
      },
      {
        id: 'LOG-7690',
        timestamp: new Date(Date.now() - 1000 * 1200).toISOString(),
        eventType: 'Kubernetes.Exec.Container',
        severity: 'HIGH',
        sourceIp: '10.244.2.14',
        user: 'kube-admin-service',
        action: 'POD_EXEC_SH',
        status: 'WARNING',
        details: { podName: 'payment-processor-98b', container: 'app' },
      },
      {
        id: 'LOG-7685',
        timestamp: new Date(Date.now() - 1000 * 2400).toISOString(),
        eventType: 'Vault.Secret.Read',
        severity: 'INFO',
        sourceIp: '10.0.1.5',
        user: 'backend-worker-01',
        action: 'READ_DB_CREDENTIALS',
        status: 'SUCCESS',
      },
    ];

    if (params.severity && params.severity !== 'ALL') {
      mockLogs = mockLogs.filter((l) => l.severity === params.severity);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      mockLogs = mockLogs.filter(
        (l) =>
          l.eventType.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.sourceIp.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q)
      );
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    return {
      data: mockLogs,
      total: mockLogs.length,
      page,
      pageSize,
      totalPages: 1,
    };
  }
}

import { apiClient } from './client';
import { SecurityLog, PaginatedResponse, SeverityLevel } from '../types';
import { simulateNetworkDelay } from './delay';

export interface LogFilterParams {
  search?: string;
  severity?: SeverityLevel | 'ALL';
  page?: number;
  pageSize?: number;
}

export const MOCK_SECURITY_LOGS: SecurityLog[] = [
  {
    id: 'LOG-7705',
    timestamp: new Date(Date.now() - 1000 * 15).toISOString(),
    eventType: 'Auth.AnomalousLogin.0315',
    severity: 'CRITICAL',
    sourceIp: '198.51.100.42',
    user: 'iam-user-svc-deployment',
    action: 'CONSOLE_LOGIN',
    status: 'WARNING',
    details: {
      fingerprint: 'fp_unrecognized_device_spb',
      country: 'RU',
      timeUtc: '03:15:22',
      uebaScore: 0.96,
      modelDecision: 'Helios Routing -> DeepLog + UEBA',
    },
  },
  {
    id: 'LOG-7704',
    timestamp: new Date(Date.now() - 1000 * 20).toISOString(),
    eventType: 'S3.MassFileAccess.Telemetry',
    severity: 'CRITICAL',
    sourceIp: '198.51.100.42',
    user: 'iam-user-svc-deployment',
    action: 'BULK_GET_OBJECT',
    status: 'WARNING',
    details: {
      bucket: 'prod-customer-backups',
      filesAccessed: 14200,
      deepLogScore: 0.82,
      logFormerScore: 0.88,
    },
  },
  {
    id: 'LOG-7701',
    timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
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
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
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
    eventType: 'K8s.Pod.SysAdminCapability',
    severity: 'HIGH',
    sourceIp: '10.244.0.15',
    user: 'system:serviceaccount:kube-system',
    action: 'CONTAINER_ESCAPE_ATTEMPT',
    status: 'WARNING',
    details: { pod: 'sec-runner-90a', namespace: 'kube-system' },
  },
  {
    id: 'LOG-7685',
    timestamp: new Date(Date.now() - 1000 * 1800).toISOString(),
    eventType: 'DB.Query.BulkExport',
    severity: 'HIGH',
    sourceIp: '198.51.100.42',
    user: 'db_readonly_svc',
    action: 'SELECT_OUTFILE',
    status: 'WARNING',
    details: { database: 'sql-db-core-prod-02', rowCount: 54200 },
  },
  {
    id: 'LOG-7680',
    timestamp: new Date(Date.now() - 1000 * 2400).toISOString(),
    eventType: 'SSH.Auth.FailedPassword',
    severity: 'MEDIUM',
    sourceIp: '185.220.101.5',
    user: 'root',
    action: 'FAILED_PASSWORD',
    status: 'FAILURE',
    details: { host: 'i-0a892bc13f7e911a2', attempts: 1200 },
  },
  {
    id: 'LOG-7675',
    timestamp: new Date(Date.now() - 1000 * 3600).toISOString(),
    eventType: 'CloudTrail.Digest.Verify',
    severity: 'LOW',
    sourceIp: '52.95.110.12',
    user: 'cloudtrail-integrity-job',
    action: 'VERIFY_DIGEST',
    status: 'SUCCESS',
    details: { trail: 'cloudtrail-event-logs-prod', status: 'VERIFIED' },
  },
];

export async function fetchLogs(params: LogFilterParams = {}): Promise<PaginatedResponse<SecurityLog>> {
  await simulateNetworkDelay(400, 850);
  let items = [...MOCK_SECURITY_LOGS];

  if (params.severity && params.severity !== 'ALL') {
    items = items.filter((l) => l.severity === params.severity);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (l) =>
        l.eventType.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.sourceIp.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = items.length;

  return {
    data: items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export const fetchSecurityLogs = fetchLogs;

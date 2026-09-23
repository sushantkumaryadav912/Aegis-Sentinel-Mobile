import { apiClient } from './client';
import { OverviewMetrics } from '../types';
import { MOCK_ALERTS_STORE } from './alerts';
import { simulateNetworkDelay } from './delay';

export async function fetchOverviewMetrics(): Promise<OverviewMetrics> {
  try {
    const res = await apiClient.get('/dashboard/overview');
    return res.data;
  } catch (err) {
    // Fallback Mock Data matching Web Aesthetic
    return {
      totalAlerts: 1428,
      criticalAlerts: 14,
      openAlerts: 89,
      resolvedAlerts: 1325,
      avgResponseTimeMin: 4.2,
      riskDistribution: {
        critical: 14,
        high: 42,
        medium: 128,
        low: 450,
      },
      recentAlerts: [
        {
          id: 'ALT-9901',
          title: 'Unauthorized S3 Bucket Encryption Override',
          description: 'Production object store bucket policy mutated by unrecognized IAM role arn:aws:iam::8820:role/DevOps-Temp',
          severity: 'CRITICAL',
          status: 'OPEN',
          riskScore: 98,
          riskLevel: 'CRITICAL',
          cloudProvider: 'AWS',
          resourceType: 'S3',
          resourceId: 'prod-finance-vault-v2',
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          remediationSteps: [
            'Revoke temp IAM role credentials',
            'Enforce KMS Key Policy on S3 Bucket',
            'Trigger Sentinel Automated Isolation Workflow'
          ],
          affectedServices: ['Finance Engine', 'KMS Service', 'S3 Vault'],
          assignedTo: 'SecOps Tier 3',
        },
        {
          id: 'ALT-9898',
          title: 'Kubernetes Pod Escalate Privileges Detected',
          description: 'Container root process spawned suspicious /bin/dash with setuid capability in namespace default',
          severity: 'HIGH',
          status: 'IN_PROGRESS',
          riskScore: 84,
          riskLevel: 'HIGH',
          cloudProvider: 'GCP',
          resourceType: 'GKE',
          resourceId: 'cluster-us-east-prod/pod-api-gateway-77b',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          remediationSteps: ['Cordon node gke-prod-pool-1', 'Restart pod with read-only root FS'],
          affectedServices: ['API Gateway', 'Ingress Router'],
          assignedTo: 'DevSecOps Team',
        },
        {
          id: 'ALT-9892',
          title: 'Anomalous Outbound Traffic to Suspicious IP',
          description: 'Egress rate spike (4.8 GB/s) to high-risk IP 185.220.101.4 (Known Tor Exit Node)',
          severity: 'HIGH',
          status: 'OPEN',
          riskScore: 78,
          riskLevel: 'HIGH',
          cloudProvider: 'Azure',
          resourceType: 'VM',
          resourceId: 'vm-db-replica-eu-01',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          remediationSteps: ['Apply Network Security Group rule blocking 185.220.101.4', 'Capture memory dump'],
          affectedServices: ['Postgres Replica EU'],
          assignedTo: 'SOC Team Alpha',
        },
        {
          id: 'ALT-9885',
          title: 'Multi-Factor Auth Bypass Attempt',
          description: 'Multiple failed MFA challenges followed by sudden successful login from unknown device fingerprint',
          severity: 'MEDIUM',
          status: 'RESOLVED',
          riskScore: 56,
          riskLevel: 'MEDIUM',
          cloudProvider: 'Okta',
          resourceType: 'UserSession',
          resourceId: 'user.jdoe@aegis-sentinel.io',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          remediationSteps: ['Revoke active session tokens', 'Force password reset & FIDO2 re-registration'],
          affectedServices: ['Okta SSO', 'Corporate VPN'],
          assignedTo: 'IAM Security',
        },
        {
          id: 'ALT-9870',
          title: 'Exposed SSH Port 22 in Public Subnet',
          description: 'Security group sg-038741a allowed 0.0.0.0/0 SSH inbound access',
          severity: 'LOW',
          status: 'RESOLVED',
          riskScore: 28,
          riskLevel: 'LOW',
          cloudProvider: 'AWS',
          resourceType: 'EC2',
          resourceId: 'i-0941824ab7192',
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          remediationSteps: ['Auto-remediated via Sentinel AWS Config Rule'],
          affectedServices: ['Staging Web'],
          assignedTo: 'Automated Bot',
        },
      ],
      alertsTimeline: [
        { timestamp: '00:00', count: 12 },
        { timestamp: '04:00', count: 8 },
        { timestamp: '08:00', count: 24 },
        { timestamp: '12:00', count: 45 },
        { timestamp: '16:00', count: 32 },
        { timestamp: '20:00', count: 18 },
      ],
    };
  }
  await simulateNetworkDelay(400, 850);

  const critical = MOCK_ALERTS_STORE.filter((a) => a.severity === 'CRITICAL').length;
  const high = MOCK_ALERTS_STORE.filter((a) => a.severity === 'HIGH').length;
  const medium = MOCK_ALERTS_STORE.filter((a) => a.severity === 'MEDIUM').length;
  const low = MOCK_ALERTS_STORE.filter((a) => a.severity === 'LOW').length;
  const open = MOCK_ALERTS_STORE.filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length;
  const resolved = MOCK_ALERTS_STORE.filter((a) => a.status === 'RESOLVED' || a.status === 'DISMISSED').length;

  return {
    totalAlerts: 1428 + MOCK_ALERTS_STORE.length,
    criticalAlerts: 14 + critical,
    openAlerts: 42 + open,
    resolvedAlerts: 1386 + resolved,
    avgResponseTimeMin: 3.8,
    riskDistribution: {
      critical: 14 + critical,
      high: 42 + high,
      medium: 128 + medium,
      low: 450 + low,
    },
    recentAlerts: MOCK_ALERTS_STORE.slice(0, 5),
    alertsTimeline: [
      { timestamp: '00:00', count: 4 },
      { timestamp: '03:15', count: 18 },
      { timestamp: '06:00', count: 7 },
      { timestamp: '09:00', count: 12 },
      { timestamp: '12:00', count: 24 },
      { timestamp: '15:00', count: 16 },
      { timestamp: '18:00', count: 9 },
      { timestamp: '21:00', count: 6 },
    ],
  };
}

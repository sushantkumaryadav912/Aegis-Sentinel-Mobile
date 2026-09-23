import { apiClient } from './client';
import { Alert, PaginatedResponse, SeverityLevel, AlertStatus } from '../types';
import { fetchOverviewMetrics } from './dashboard';
import { simulateNetworkDelay } from './delay';

export interface AlertFilterParams {
  severity?: SeverityLevel | 'ALL';
  status?: AlertStatus | 'ALL';
  search?: string;
  page?: number;
  pageSize?: number;
}

export const MOCK_ALERTS_STORE: Alert[] = [
  {
    id: 'ALT-9900',
    title: 'Anomalous 03:15 Credential Login & Mass File Access',
    description: 'User logged in at 03:15 UTC from an unrecognized device fingerprint and initiated rapid bulk file read operations across production S3 storage. Routed via Helios Capability Router: DeepLog (0.82), LogFormer (0.88), UEBA (0.96), and Isolation Forest (0.79).',
    severity: 'CRITICAL',
    status: 'OPEN',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    cloudProvider: 'AWS',
    resourceType: 'IAM / S3',
    resourceId: 'iam-user-svc-deployment',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    remediationSteps: [
      'Helios Score Fusion: 0.20*IF(0.79) + 0.30*DeepLog(0.82) + 0.20*LogFormer(0.88) + 0.30*UEBA(0.96) = 0.89',
      'Revoke active STS credentials for iam-user-svc-deployment',
      'Execute Forge SOAR Playbook WF-501 (Auto-Quarantine & Session Invalidation)',
    ],
    affectedServices: ['AWS IAM', 'Amazon S3', 'AWS CloudTrail', 'GuardDuty'],
    assignedTo: 'SecOps Tier 3',
  },
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
      'Trigger Sentinel Automated Isolation Workflow',
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
    resourceId: 'i-09f8721345eb11029',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    remediationSteps: ['Restrict SSH ingress to corporate VPN bastion CIDR'],
    affectedServices: ['EC2 Bastion', 'VPC Routing'],
    assignedTo: 'SecOps Tier 1',
  },
  {
    id: 'ALT-9860',
    title: 'Kubelet Unauthenticated Read Access',
    description: 'Read-only port 10255 exposed on worker node pool',
    severity: 'MEDIUM',
    status: 'OPEN',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    cloudProvider: 'AWS',
    resourceType: 'EKS',
    resourceId: 'eks-node-302',
    timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    remediationSteps: ['Disable read-only port in kubelet configuration'],
    affectedServices: ['EKS Control Plane'],
    assignedTo: 'SecOps Tier 2',
  },
  {
    id: 'ALT-9852',
    title: 'Database Password Leak in Git Commit',
    description: 'Plaintext DB URI found in public repository commit push',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    riskScore: 95,
    riskLevel: 'CRITICAL',
    cloudProvider: 'GitHub',
    resourceType: 'Repository',
    resourceId: 'org/backend-core',
    timestamp: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    remediationSteps: ['Rotate database user passwords', 'Revoke Git commit & scrub history'],
    affectedServices: ['GitHub Enterprise', 'PostgreSQL Cluster'],
    assignedTo: 'AppSec Lead',
  },
  {
    id: 'ALT-9840',
    title: 'CloudTrail Log Stream Disrupted',
    description: 'Audit log stream stop event recorded by root account',
    severity: 'HIGH',
    status: 'OPEN',
    riskScore: 88,
    riskLevel: 'HIGH',
    cloudProvider: 'AWS',
    resourceType: 'CloudTrail',
    resourceId: 'main-audit-trail',
    timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    remediationSteps: ['Re-enable CloudTrail logging stream', 'Investigate root account activity'],
    affectedServices: ['AWS CloudTrail', 'SIEM Collector'],
    assignedTo: 'Incident Commander',
  },
];
export async function fetchAlerts(params: AlertFilterParams = {}): Promise<PaginatedResponse<Alert>> {
  await simulateNetworkDelay(500, 950);
  let items = [...MOCK_ALERTS_STORE];

  if (params.severity && params.severity !== 'ALL') {
    items = items.filter((a) => a.severity === params.severity);
  }
  if (params.status && params.status !== 'ALL') {
    items = items.filter((a) => a.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.resourceId.toLowerCase().includes(q)
    );
  }

    if (params.severity && params.severity !== 'ALL') {
      items = items.filter((a) => a.severity === params.severity);
    }
    if (params.status && params.status !== 'ALL') {
      items = items.filter((a) => a.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.resourceId.toLowerCase().includes(q)
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

export async function fetchAlertById(id: string): Promise<Alert | null> {
  await simulateNetworkDelay(300, 700);

  const found = MOCK_ALERTS_STORE.find((a) => a.id.toLowerCase() === id.toLowerCase());
  if (found) return { ...found };

  return {
    id,
    title: `Alert ${id} Details`,
    description: 'Automated threat detection alert generated by Aegis Sentinel Real-time Engine.',
    severity: 'HIGH',
    status: 'OPEN',
    riskScore: 82,
    riskLevel: 'HIGH',
    cloudProvider: 'AWS',
    resourceType: 'EC2 / IAM',
    resourceId: `res-${id.toLowerCase()}-instance`,
    timestamp: new Date().toISOString(),
    remediationSteps: [
      'Isolate compromised workload using Security Group lockdown',
      'Revoke temporary AWS IAM credentials',
      'Trigger SOC Playbook #42 (Automated Containment)',
    ],
    affectedServices: ['Core API Server', 'User Database', 'Cache Layer'],
    assignedTo: 'SecOps Response Team',
  };
}

export async function updateAlertStatus(id: string, status: AlertStatus): Promise<Alert> {
  await simulateNetworkDelay(450, 900);

  const alert = await fetchAlertById(id);
  const updated = { ...alert!, status };

  const idx = MOCK_ALERTS_STORE.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
  if (idx !== -1) {
    MOCK_ALERTS_STORE[idx] = updated;
  }

  return updated;
}

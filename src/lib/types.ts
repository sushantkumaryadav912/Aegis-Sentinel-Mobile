export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AlertStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: AlertStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  cloudProvider: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  remediationSteps?: string[];
  affectedServices?: string[];
  assignedTo?: string;
}

export interface OverviewMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  openAlerts: number;
  resolvedAlerts: number;
  avgResponseTimeMin: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recentAlerts: Alert[];
  alertsTimeline: { timestamp: string; count: number }[];
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: string;
  severity: SeverityLevel;
  sourceIp: string;
  user: string;
  action: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details?: Record<string, any>;
}

export interface Workflow {
  id: string;
  alertId: string;
  name: string;
  type: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PENDING';
  executedBy: string;
  startTime: string;
  endTime?: string;
  stepsCount: number;
  completedSteps: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetResource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED';
}

export interface OracleMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface ThreatIntel {
  id: string;
  indicator: string;
  type: 'IP' | 'DOMAIN' | 'HASH' | 'URL' | 'IP REPUTATION' | 'CVE EXPLOIT' | 'DOMAIN THREAT' | 'MALWARE HASH' | string;
  severity: SeverityLevel;
  confidence: number;
  source: string;
  description: string;
  firstSeen: string;
  lastSeen: string;
}

export interface PrismNode {
  id: string;
  label: string;
  type: 'USER' | 'IP' | 'HOST' | 'ALERT' | 'SERVICE';
  status: 'COMPROMISED' | 'SUSPICIOUS' | 'SAFE';
  riskScore: number;
}

export interface PrismEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export type UserPersona =
  | 'PLATFORM_OWNER'
  | 'SECURITY_MANAGER'
  | 'SOC_ANALYST'
  | 'SECURITY_ENGINEER'
  | 'CLOUD_ADMIN'
  | 'AUDITOR_EXECUTIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  persona: UserPersona;
  permissions: string[];
  organizationId?: string;
  avatarUrl?: string;
}

export interface ForgePlaybook {
  id: string;
  name: string;
  description: string;
  category: 'REMEDIATION' | 'ENRICHMENT' | 'ISOLATION' | 'NOTIFICATION';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'PAUSED';
  lastRun: string;
  successRate: number;
  triggerEvent: string;
  requiresApproval: boolean;
}

export interface PulseCollector {
  id: string;
  name: string;
  provider: 'AWS' | 'AZURE' | 'GCP' | 'KAFKA' | 'KUBERNETES';
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  eventsPerSec: number;
  lagMs: number;
  lastHeartbeat: string;
}

export interface NexusConnector {
  id: string;
  name: string;
  type: 'CLOUD' | 'COMMUNICATION' | 'TICKETING' | 'SIEM';
  provider: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSync: string;
}

export interface VaultEvidence {
  id: string;
  title: string;
  type: 'LOG_EXPORT' | 'PCAP' | 'MEMORY_DUMP' | 'REPORT' | 'CREDENTIAL_ROTATION';
  classification: 'TOP_SECRET' | 'RESTRICTED' | 'CONFIDENTIAL';
  sizeBytes: number;
  createdTime: string;
  associatedIncidentId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

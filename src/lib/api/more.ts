import { apiClient } from './client';
import { ThreatIntel, PrismNode, PrismEdge, AuditLog } from '../types';
import { simulateNetworkDelay } from './delay';

export async function fetchThreatIntel(): Promise<{ globalRiskLevel: string; threatFeed: ThreatIntel[] }> {
  await simulateNetworkDelay(400, 850);
  return {
    globalRiskLevel: 'HIGH',
    threatFeed: [
      {
        id: 'IOC-198',
        indicator: '198.51.100.42',
        type: 'IP REPUTATION',
        severity: 'HIGH',
        confidence: 96,
        source: 'Aegis Intelligence Hub',
        description: 'Known Tor Exit Node / Botnet Command Server targeting API gateways.',
        firstSeen: '2026-07-25T14:30:00Z',
        lastSeen: '2 minutes ago',
      },
      {
        id: 'CVE-2819',
        indicator: 'CVE-2026-2819',
        type: 'CVE EXPLOIT',
        severity: 'CRITICAL',
        confidence: 99,
        source: 'MITRE ATT&CK Mapping',
        description: 'AWS IAM Privilege Escalation exploit scan abusing unverified STS session tokens.',
        firstSeen: '2026-07-25T14:20:00Z',
        lastSeen: '12 minutes ago',
      },
      {
        id: 'DOM-442',
        indicator: 'malicious-auth-portal.com',
        type: 'DOMAIN THREAT',
        severity: 'HIGH',
        confidence: 94,
        source: 'AlienVault OTX Feed',
        description: 'Phishing domain mimicking corporate Okta Single-Sign-On authentication portal.',
        firstSeen: '2026-07-25T13:45:00Z',
        lastSeen: '45 minutes ago',
      },
      {
        id: 'HASH-3b0',
        indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        type: 'MALWARE HASH',
        severity: 'CRITICAL',
        confidence: 100,
        source: 'Sentinel Sandbox',
        description: 'SHA-256 hash of Cobalt Strike ransomware loader payload.',
        firstSeen: '2026-07-25T13:30:00Z',
        lastSeen: '1 hour ago',
      },
      {
        id: 'IOC-203',
        indicator: '203.0.113.111',
        type: 'IP REPUTATION',
        severity: 'MEDIUM',
        confidence: 88,
        source: 'AbuseIPDB Synced',
        description: 'Active brute-force attempt against SSH grids and bastion servers.',
        firstSeen: '2026-07-25T12:30:00Z',
        lastSeen: '2 hours ago',
      },
    ],
  };
}

export async function fetchPrismGraph(): Promise<{ nodes: PrismNode[]; edges: PrismEdge[] }> {
  await simulateNetworkDelay(450, 900);
  return {
    nodes: [
      { id: 'n0', label: '03:15 Actor (iam-user-svc)', type: 'USER', status: 'COMPROMISED', riskScore: 89 },
      { id: 'n1', label: 'DevOps-Temp Role', type: 'USER', status: 'COMPROMISED', riskScore: 98 },
      { id: 'n2', label: 'prod-secrets-vault', type: 'SERVICE', status: 'SUSPICIOUS', riskScore: 92 },
      { id: 'n3', label: '198.51.100.42 (Tor Exit)', type: 'IP', status: 'COMPROMISED', riskScore: 96 },
      { id: 'n4', label: 'ALT-9900 Alert', type: 'ALERT', status: 'COMPROMISED', riskScore: 89 },
      { id: 'n5', label: 'KMS Key #882', type: 'SERVICE', status: 'SAFE', riskScore: 30 },
      { id: 'n6', label: 'Predicted Target: DB PII', type: 'SERVICE', status: 'SUSPICIOUS', riskScore: 85 },
    ],
    edges: [
      { id: 'e0', source: 'n3', target: 'n0', label: '03:15 Login' },
      { id: 'e1', source: 'n0', target: 'n2', label: 'Bulk Download' },
      { id: 'e2', source: 'n0', target: 'n4', label: 'Triggered' },
      { id: 'e3', source: 'n1', target: 'n2', label: 'Mutated Policy' },
      { id: 'e4', source: 'n2', target: 'n5', label: 'Key Request' },
      { id: 'e5', source: 'n0', target: 'n6', label: 'Temporal GNN (Predicted 88%)' },
    ],
  };
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  await simulateNetworkDelay(400, 850);
  return [
    {
      id: 'AUD-901',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      actor: 'sushant.admin',
      role: 'SecOps Administrator',
      action: 'EXECUTE_WORKFLOW_ISOLATION',
      targetResource: 'ALT-9900',
      ipAddress: '172.16.4.12',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-898',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      actor: 'helios.fusion.engine',
      role: 'Sentinel Core',
      action: 'MODEL_FUSION_SCORING',
      targetResource: 'ALT-9900 (Score 0.89)',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-895',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      actor: 'sentinel.bot',
      role: 'Automated Agent',
      action: 'AUTO_RESOLVE_ALERT',
      targetResource: 'ALT-9870',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-890',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      actor: 'unknown.user',
      role: 'Guest',
      action: 'MODIFY_ALERT_POLICY',
      targetResource: 'GLOBAL_POLICY',
      ipAddress: '198.51.100.8',
      status: 'DENIED',
    },
  ];
}

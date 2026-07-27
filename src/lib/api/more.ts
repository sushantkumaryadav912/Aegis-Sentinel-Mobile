import { apiClient } from './client';
import { ThreatIntel, PrismNode, PrismEdge, AuditLog } from '../types';

export async function fetchThreatIntel(): Promise<{ globalRiskLevel: string; threatFeed: ThreatIntel[] }> {
  try {
    const res = await apiClient.get('/watchtower/threat-intel');
    return res.data;
  } catch (err) {
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
}

export async function fetchPrismGraph(): Promise<{ nodes: PrismNode[]; edges: PrismEdge[] }> {
  try {
    const res = await apiClient.get('/prism/graph');
    return res.data;
  } catch (err) {
    return {
      nodes: [
        { id: 'n1', label: 'DevOps-Temp Role', type: 'USER', status: 'COMPROMISED', riskScore: 98 },
        { id: 'n2', label: 'prod-finance-vault', type: 'SERVICE', status: 'SUSPICIOUS', riskScore: 90 },
        { id: 'n3', label: '185.220.101.4', type: 'IP', status: 'COMPROMISED', riskScore: 99 },
        { id: 'n4', label: 'ALT-9901 Alert', type: 'ALERT', status: 'COMPROMISED', riskScore: 98 },
        { id: 'n5', label: 'KMS Key #882', type: 'SERVICE', status: 'SAFE', riskScore: 30 },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', label: 'Mutated Policy' },
        { id: 'e2', source: 'n2', target: 'n3', label: 'Egress Traffic' },
        { id: 'e3', source: 'n1', target: 'n4', label: 'Triggered' },
        { id: 'e4', source: 'n2', target: 'n5', label: 'Key Request' },
      ],
    };
  }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const res = await apiClient.get('/audit-logs');
    return res.data;
  } catch (err) {
    return [
      {
        id: 'AUD-901',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        actor: 'sushant.admin',
        role: 'SecOps Administrator',
        action: 'EXECUTE_WORKFLOW_ISOLATION',
        targetResource: 'ALT-9901',
        ipAddress: '172.16.4.12',
        status: 'SUCCESS',
      },
      {
        id: 'AUD-898',
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
}

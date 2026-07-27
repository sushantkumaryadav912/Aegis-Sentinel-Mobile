import { apiClient } from './client';
import { OracleMessage } from '../types';

export async function sendOracleQuery(query: string): Promise<OracleMessage> {
  try {
    const res = await apiClient.post('/oracle/chat', { prompt: query });
    return res.data;
  } catch (err) {
    // Smart AI mock responder based on prompt keywords
    const lower = query.toLowerCase();
    let reply = `I am Aegis Sentinel Oracle AI. I've analyzed your telemetry request regarding "${query}".`;
    let suggestions = ['Show critical alerts', 'Run isolation workflow', 'Explain MITRE ATT&CK mapping'];

    if (lower.includes('s3') || lower.includes('encryption') || lower.includes('alt-9901')) {
      reply = `Alert **ALT-9901** is an Unauthorized S3 Bucket Encryption Override on \`prod-finance-vault-v2\`.\n\n**Key Findings:**\n1. Temporary role \`DevOps-Temp\` deleted key policy.\n2. Threat level: **CRITICAL (Risk 98/100)**.\n\n**Recommended Actions:**\n- Revoke IAM credentials for role \`DevOps-Temp\`\n- Execute SOAR Workflow **WF-501** (Auto Isolation).`;
      suggestions = ['Execute WF-501 now', 'Show IAM policy diff', 'Filter logs for DevOps-Temp'];
    } else if (lower.includes('alert') || lower.includes('critical')) {
      reply = `Currently tracking **14 Critical Alerts** across multi-cloud infrastructure.\n\n- Highest risk: **ALT-9901** (S3 Encryption Override, Risk 98)\n- Second highest: **ALT-9852** (DB Credential Leak in GitHub, Risk 95)\n\nWould you like me to trigger containment on these resources?`;
      suggestions = ['Contain ALT-9901', 'Contain ALT-9852', 'Show all high alerts'];
    } else if (lower.includes('log') || lower.includes('kms') || lower.includes('ip')) {
      reply = `Analyzed recent logs matching query. High egress traffic detected to **185.220.101.4** (Tor Exit Node) from \`vm-db-replica-eu-01\`. Firewall block rule recommended.`;
      suggestions = ['Block IP 185.220.101.4', 'Show traffic graph', 'Inspect VM metrics'];
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'bot',
      text: reply,
      timestamp: new Date().toISOString(),
      suggestions,
    };
  }
}

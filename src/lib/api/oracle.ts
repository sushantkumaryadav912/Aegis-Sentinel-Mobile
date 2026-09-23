import { apiClient } from './client';
import { OracleMessage } from '../types';
import { simulateNetworkDelay } from './delay';

export async function sendOracleQuery(query: string): Promise<OracleMessage> {
  await simulateNetworkDelay(600, 1150);

  const lower = query.toLowerCase();
  let reply = `I am Aegis Sentinel Oracle AI (backed by Qwen3-32B & Llama 3.3 70B reasoning engines). I have evaluated your query regarding "${query}".`;
  let suggestions = ['Show critical alerts', 'Explain Helios model routing', 'Review Forge SOAR playbooks'];

  if (lower.includes('routing') || lower.includes('fusion') || lower.includes('03:15') || lower.includes('helios') || lower.includes('matrix')) {
    reply = `**Helios AI/ML Model Routing & Score Fusion Analysis:**\n\n• **Core Principle**: "Helios detects. Correlation connects. Prism predicts. Oracle investigates. Watchtower retrieves knowledge. Forge generates remediation."\n\n• **Incident Scenario (03:15 UTC Credential Anomaly)**:\n  - Telemetry: Auth sequence + Behavioral features + S3 access\n  - Model Scores:\n    - **DeepLog v2**: 0.82 (Ordered log sequence anomaly)\n    - **LogFormer**: 0.88 (Contextual log reasoning)\n    - **UEBA Behavioral**: 0.96 (Unusual 3 AM login & unknown device)\n    - **Isolation Forest v4**: 0.79 (Numerical baseline spike)\n    - **LogBERT v3**: 0.84 [SHADOW MODE - non-blocking]\n  - **Score Fusion Formula**:\n    \`Final Risk = 0.20×IF(0.79) + 0.30×DeepLog(0.82) + 0.20×LogFormer(0.88) + 0.30×UEBA(0.96) = 0.89\`\n\n• **Action**: Alert **ALT-9900** created -> Routed to Forge Playbook **WF-502** for automated quarantine.`;
    suggestions = ['Execute WF-502 now', 'View DeepLog sequence details', 'Inspect Prism attack graph'];
  } else if (lower.includes('s3') || lower.includes('encryption') || lower.includes('alt-9901')) {
    reply = `Alert **ALT-9901** is an Unauthorized S3 Bucket Encryption Override on \`prod-finance-vault-v2\`.\n\n**Key Findings:**\n1. Temporary role \`DevOps-Temp\` deleted key policy.\n2. Threat level: **CRITICAL (Risk 98/100)**.\n\n**Recommended Actions:**\n- Revoke IAM credentials for role \`DevOps-Temp\`\n- Execute SOAR Workflow **WF-501** (Auto Isolation).`;
    suggestions = ['Execute WF-501 now', 'Show IAM policy diff', 'Filter logs for DevOps-Temp'];
  } else if (lower.includes('alert') || lower.includes('critical')) {
    reply = `Currently tracking **15 Critical/High Alerts** across multi-cloud infrastructure.\n\n- Highest risk: **ALT-9901** (S3 Encryption Override, Risk 98)\n- Flagship ML Incident: **ALT-9900** (03:15 Credential Exfiltration, Score Fusion 0.89)\n- Second highest: **ALT-9852** (DB Password Leak in GitHub, Risk 95)\n\nWould you like me to trigger containment on these resources?`;
    suggestions = ['Contain ALT-9900', 'Contain ALT-9901', 'Show all open alerts'];
  } else if (lower.includes('log') || lower.includes('kms') || lower.includes('ip')) {
    reply = `Analyzed recent telemetry logs matching query. High egress traffic detected to **185.220.101.4** (Tor Exit Node) from \`vm-db-replica-eu-01\`. Firewall block rule recommended.`;
    suggestions = ['Block IP 185.220.101.4', 'Show traffic graph', 'Inspect VM metrics'];
  } else if (lower.includes('forge') || lower.includes('remediat') || lower.includes('terraform')) {
    reply = `**Forge Remediation Engine (Qwen2.5-Coder-32B & DeepSeek-Coder-V2):**\nAll remediations require analyst approval before dispatching.\n\n\`\`\`hcl\nresource "aws_s3_bucket_public_access_block" "lockdown" {\n  bucket                  = "prod-secrets-vault-01"\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}\n\`\`\`\n\nClick below to approve execution.`;
    suggestions = ['Approve Terraform apply', 'Show rollback plan', 'Check CIS compliance'];
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'bot',
    text: reply,
    timestamp: new Date().toISOString(),
    suggestions,
  };
}

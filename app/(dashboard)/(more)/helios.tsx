import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Cpu,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Sparkles,
  GitBranch,
  ShieldAlert,
  Sliders,
} from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { simulateNetworkDelay } from '../../../src/lib/api/delay';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

interface HeliosModelItem {
  id: string;
  name: string;
  domain: string;
  engine: 'Sentinel Core' | 'Prism' | 'Oracle' | 'Forge' | 'Watchtower';
  capability: string;
  runtime: string;
  status: 'production' | 'experimental' | 'benchmark';
  avgLatency: string;
  confidence: number;
  memory: string;
  primaryQuestion: string;
  description: string;
}

const HELIOS_MODELS: HeliosModelItem[] = [
  // Sentinel Core — Helios Detection (10 models)
  {
    id: 'isolation_forest',
    name: 'Isolation Forest v4',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'General Anomaly Detection',
    runtime: 'scikit-learn',
    status: 'production',
    avgLatency: '12ms',
    confidence: 0.94,
    memory: '256 MB',
    primaryQuestion: 'Is numerical telemetry anomalous?',
    description: 'General-purpose baseline for structured telemetry: login attempts, byte volume, process count, CPU usage.',
  },
  {
    id: 'deeplog',
    name: 'DeepLog v2',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Sequence Anomaly Detection',
    runtime: 'PyTorch',
    status: 'production',
    avgLatency: '18ms',
    confidence: 0.92,
    memory: '1.1 GB',
    primaryQuestion: 'Is log event order anomalous?',
    description: 'Sequential LSTM execution pattern modeling for Syslog, authentication, and CloudTrail event sequences.',
  },
  {
    id: 'logformer',
    name: 'LogFormer',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Contextual Log Reasoning',
    runtime: 'PyTorch',
    status: 'production',
    avgLatency: '21ms',
    confidence: 0.96,
    memory: '2.1 GB',
    primaryQuestion: 'Do multi-event log relationships indicate threat?',
    description: 'Sparse-attention long-context log transformer for enterprise cloud environment telemetry.',
  },
  {
    id: 'ueba_behavioral',
    name: 'UEBA Behavioral Model',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Behavioral Anomaly Detection',
    runtime: 'PyTorch',
    status: 'production',
    avgLatency: '14ms',
    confidence: 0.97,
    memory: '1.8 GB',
    primaryQuestion: 'Is user or entity behavior anomalous?',
    description: 'Detects baseline deviations across user, device, IP, service account, and cloud workload activity.',
  },
  {
    id: 'lof',
    name: 'Local Outlier Factor (LOF)',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Local-Density Anomaly Detection',
    runtime: 'scikit-learn',
    status: 'experimental',
    avgLatency: '16ms',
    confidence: 0.81,
    memory: '512 MB',
    primaryQuestion: 'Is event unusual relative to peer group?',
    description: 'Detects observations unusual within local peer groups (e.g. developers vs HR vs finance).',
  },
  {
    id: 'hbos',
    name: 'Histogram-Based Outlier (HBOS)',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Fast Statistical Screening',
    runtime: 'scikit-learn',
    status: 'experimental',
    avgLatency: '4ms',
    confidence: 0.79,
    memory: '128 MB',
    primaryQuestion: 'High-speed anomaly screening pass?',
    description: 'Ultra-fast statistical histogram independent feature scoring for real-time telemetry.',
  },
  {
    id: 'one_class_svm',
    name: 'One-Class SVM',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Novelty Detection',
    runtime: 'scikit-learn',
    status: 'experimental',
    avgLatency: '22ms',
    confidence: 0.85,
    memory: '768 MB',
    primaryQuestion: 'Does event deviate from learned normal?',
    description: 'Learns boundary of normal observations when legitimate data dominates training sets.',
  },
  {
    id: 'autoencoder',
    name: 'Autoencoder Neural Net',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Reconstruction Anomaly Detection',
    runtime: 'PyTorch',
    status: 'experimental',
    avgLatency: '15ms',
    confidence: 0.88,
    memory: '1.2 GB',
    primaryQuestion: 'Are feature combinations unusual?',
    description: 'Deep neural network reconstruction error scoring for complex non-linear feature interactions.',
  },
  {
    id: 'vae',
    name: 'Variational Autoencoder (VAE)',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Probabilistic Anomaly Detection',
    runtime: 'PyTorch',
    status: 'experimental',
    avgLatency: '19ms',
    confidence: 0.89,
    memory: '1.4 GB',
    primaryQuestion: 'Does event fit probabilistic feature distribution?',
    description: 'Learns probabilistic latent representations when normal security behavior exhibits wide variation.',
  },
  {
    id: 'logbert',
    name: 'LogBERT v3',
    domain: 'Detection',
    engine: 'Sentinel Core',
    capability: 'Context-Aware Log Anomaly',
    runtime: 'PyTorch',
    status: 'experimental',
    avgLatency: '24ms',
    confidence: 0.95,
    memory: '2.4 GB',
    primaryQuestion: 'Shadow evaluation of transformer log context?',
    description: 'Transformer bidirectional log sequence embedding operating in Shadow Mode for model validation.',
  },

  // Sentinel Core — Correlation Models (6 models)
  {
    id: 'node2vec',
    name: 'Node2Vec',
    domain: 'Correlation',
    engine: 'Sentinel Core',
    capability: 'Entity Relationship Embedding',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '32ms',
    confidence: 0.91,
    memory: '1.5 GB',
    primaryQuestion: 'How are entities positioned in graph space?',
    description: 'Random walk network representations mapping cloud identities and resources into dense vectors.',
  },
  {
    id: 'graphsage',
    name: 'GraphSAGE',
    domain: 'Correlation',
    engine: 'Sentinel Core',
    capability: 'Neighbor Feature Aggregation',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '28ms',
    confidence: 0.93,
    memory: '2.0 GB',
    primaryQuestion: 'What neighborhood attributes correlate to attack?',
    description: 'Inductive representation learning generating embeddings by sampling and aggregating neighbor features.',
  },
  {
    id: 'gcn',
    name: 'Graph Convolutional Network (GCN)',
    domain: 'Correlation',
    engine: 'Sentinel Core',
    capability: 'Graph Convolution',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '26ms',
    confidence: 0.92,
    memory: '1.8 GB',
    primaryQuestion: 'Are multi-hop cloud relationships connected?',
    description: 'Spectral graph convolutions capturing structural connectivity across VPCs, IAM roles, and containers.',
  },
  {
    id: 'gat',
    name: 'Graph Attention Network (GAT)',
    domain: 'Correlation',
    engine: 'Sentinel Core',
    capability: 'Attention-based Graph Reasoning',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '36ms',
    confidence: 0.95,
    memory: '2.4 GB',
    primaryQuestion: 'Which attack edges carry highest threat weight?',
    description: 'Multi-head self-attention weighing critical lateral movement edges over benign background edges.',
  },
  {
    id: 'temporal_gnn',
    name: 'Temporal Graph Neural Network',
    domain: 'Correlation',
    engine: 'Sentinel Core',
    capability: 'Time-Aware Attack Correlation',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '42ms',
    confidence: 0.96,
    memory: '3.1 GB',
    primaryQuestion: 'How is attack topology evolving over time?',
    description: 'Dynamic time-stamped graph neural network capturing multi-stage attack evolution.',
  },
  {
    id: 'graph_transformer',
    name: 'Graph Transformer',
    domain: 'Correlation',
    engine: 'Sentinel Core',
    capability: 'Advanced Attack Graph Reasoning',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '48ms',
    confidence: 0.97,
    memory: '3.6 GB',
    primaryQuestion: 'Are disparate cloud events part of a coordinated campaign?',
    description: 'Global all-to-all attention graph transformer detecting sophisticated APT cross-account campaigns.',
  },

  // Prism Models (4 models)
  {
    id: 'temporal_transformer',
    name: 'Temporal Transformer Network',
    domain: 'Prediction',
    engine: 'Prism',
    capability: 'Future Event Prediction',
    runtime: 'PyTorch',
    status: 'benchmark',
    avgLatency: '45ms',
    confidence: 0.94,
    memory: '2.8 GB',
    primaryQuestion: 'What security event will occur next?',
    description: 'Autoregressive sequence prediction forecasting next targeted API endpoints.',
  },
  {
    id: 'lstm_gru_predictor',
    name: 'LSTM / GRU Temporal Predictor',
    domain: 'Prediction',
    engine: 'Prism',
    capability: 'Temporal Risk Forecasting',
    runtime: 'PyTorch',
    status: 'benchmark',
    avgLatency: '20ms',
    confidence: 0.89,
    memory: '1.2 GB',
    primaryQuestion: 'What is temporal trajectory of blast radius?',
    description: 'Recurrent unit forecasting short-term telemetry surges and credential misuse probability.',
  },
  {
    id: 'timeseries_forecaster',
    name: 'Time-Series Forecaster',
    domain: 'Prediction',
    engine: 'Prism',
    capability: 'Risk & Event Forecasting',
    runtime: 'scikit-learn',
    status: 'benchmark',
    avgLatency: '15ms',
    confidence: 0.87,
    memory: '512 MB',
    primaryQuestion: 'When will risk threshold breach critical tier?',
    description: 'Statistical autoregressive forecaster predicting metric spikes across cloud infrastructure.',
  },
  {
    id: 'prism_temporal_gnn',
    name: 'Temporal GNN (Prism Evolution)',
    domain: 'Prediction',
    engine: 'Prism',
    capability: 'Attack-Path Evolution Prediction',
    runtime: 'PyTorch Geometric',
    status: 'benchmark',
    avgLatency: '44ms',
    confidence: 0.95,
    memory: '2.6 GB',
    primaryQuestion: 'What is the adversary likely to target next?',
    description: 'Predictive attack path forecasting showing next probable compromised targets in Prism visualizer.',
  },

  // Oracle Models (5 models)
  {
    id: 'qwen3_4b',
    name: 'Qwen3-4B Instruct',
    domain: 'Investigation',
    engine: 'Oracle',
    capability: 'Fast Reasoning & Triage',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '110ms',
    confidence: 0.92,
    memory: '8.0 GB',
    primaryQuestion: 'What does this incoming alert mean immediately?',
    description: 'Ultra-fast lightweight LLM candidate for initial log triage, schema extraction, and alert parsing.',
  },
  {
    id: 'qwen3_32b',
    name: 'Qwen3-32B Instruct',
    domain: 'Investigation',
    engine: 'Oracle',
    capability: 'Deep Security Reasoning',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '340ms',
    confidence: 0.97,
    memory: '64.0 GB',
    primaryQuestion: 'What is root cause and complete chain of compromise?',
    description: 'High-parameter LLM powering Oracle deep incident root-cause synthesis and forensic reasoning.',
  },
  {
    id: 'llama3_70b',
    name: 'Meta Llama 3.3 70B Instruct',
    domain: 'Investigation',
    engine: 'Oracle',
    capability: 'General Security Reasoning',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '520ms',
    confidence: 0.98,
    memory: '140.0 GB',
    primaryQuestion: 'How to explain this enterprise incident to leadership?',
    description: 'Flagship open-weights model candidate for complex cross-cloud attack chain explanations.',
  },
  {
    id: 'mistral_24b',
    name: 'Mistral Small 24B Instruct',
    domain: 'Investigation',
    engine: 'Oracle',
    capability: 'Reasoning & Summarization',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '260ms',
    confidence: 0.94,
    memory: '48.0 GB',
    primaryQuestion: 'What is executive summary of incident impact?',
    description: 'Optimized reasoning & executive incident summary generator for analyst reports.',
  },
  {
    id: 'gemma3_27b',
    name: 'Google Gemma 3 27B IT',
    domain: 'Investigation',
    engine: 'Oracle',
    capability: 'Lightweight Security Reasoning',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '290ms',
    confidence: 0.93,
    memory: '54.0 GB',
    primaryQuestion: 'What are recommended triage steps for analyst?',
    description: 'Google Gemma 3 architecture candidate for fast interactive analyst Q&A and investigation guidance.',
  },

  // Forge Models (2 models)
  {
    id: 'qwen_coder_32b',
    name: 'Qwen2.5-Coder-32B Instruct',
    domain: 'Remediation',
    engine: 'Forge',
    capability: 'Terraform & K8s Remediation',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '380ms',
    confidence: 0.96,
    memory: '64.0 GB',
    primaryQuestion: 'How to remediate cloud misconfiguration via Terraform?',
    description: 'Generates syntactically verified Terraform diffs, Ansible playbooks, and Kubernetes NetworkPolicies.',
  },
  {
    id: 'deepseek_coder_v2',
    name: 'DeepSeek-Coder-V2 Instruct',
    domain: 'Remediation',
    engine: 'Forge',
    capability: 'Infrastructure & Code Generation',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '410ms',
    confidence: 0.97,
    memory: '72.0 GB',
    primaryQuestion: 'What code fixes IAM policies & firewalls safely?',
    description: 'Specialized code generation LLM for complex IAM policy remediation & cloud security patches.',
  },

  // Watchtower Models (5 models)
  {
    id: 'bge_large',
    name: 'BAAI BGE Large EN',
    domain: 'Embeddings',
    engine: 'Watchtower',
    capability: 'Security Knowledge Embeddings',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '14ms',
    confidence: 0.95,
    memory: '1.3 GB',
    primaryQuestion: 'What knowledge is relevant in security corpus?',
    description: '1024-dim dense embeddings for MITRE ATT&CK, NIST standards & SIGMA rule indexing in Watchtower.',
  },
  {
    id: 'e5_large',
    name: 'Intfloat E5 Large v2',
    domain: 'Embeddings',
    engine: 'Watchtower',
    capability: 'Semantic Threat Retrieval',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '16ms',
    confidence: 0.93,
    memory: '1.4 GB',
    primaryQuestion: 'Which CVEs and threat intelligence feeds match query?',
    description: 'Bidirectional encoder representations for semantic retrieval against 1.48M IoC records.',
  },
  {
    id: 'nomic_embed',
    name: 'Nomic Embed Text v1.5',
    domain: 'Embeddings',
    engine: 'Watchtower',
    capability: 'General-Domain Embeddings',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '11ms',
    confidence: 0.91,
    memory: '550 MB',
    primaryQuestion: 'How to index long-context multi-cloud audit logs?',
    description: 'High-throughput 8192 token context window embedding model for multi-line cloud audit log payloads.',
  },
  {
    id: 'bge_reranker',
    name: 'BAAI BGE Reranker Large',
    domain: 'Reranking',
    engine: 'Watchtower',
    capability: 'Cross-Encoder Reranking',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '24ms',
    confidence: 0.96,
    memory: '2.1 GB',
    primaryQuestion: 'Which retrieved knowledge item is most relevant?',
    description: 'Cross-encoder scoring retrieved CVE playbooks and IoCs to feed high-precision context to Oracle.',
  },
  {
    id: 'cross_encoder',
    name: 'MS MARCO MiniLM Cross-Encoder',
    domain: 'Reranking',
    engine: 'Watchtower',
    capability: 'Semantic Relevance Ranking',
    runtime: 'vLLM / Transformers',
    status: 'benchmark',
    avgLatency: '18ms',
    confidence: 0.92,
    memory: '400 MB',
    primaryQuestion: 'Fast top-10 candidate reranking?',
    description: 'Lightweight neural reranker providing fast second-pass relevance filtering for threat indicators.',
  },
];

const DOMAINS = ['ALL', 'Detection', 'Correlation', 'Prediction', 'Investigation', 'Remediation', 'Embeddings', 'Reranking'];
const STATUSES = ['ALL', 'production', 'experimental', 'benchmark'];

export default function HeliosCatalogueScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await simulateNetworkDelay(500, 900);
    setRefreshing(false);
  };

  const filteredModels = HELIOS_MODELS.filter((m) => {
    if (selectedDomain !== 'ALL' && m.domain !== selectedDomain) return false;
    if (selectedStatus !== 'ALL' && m.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCap = m.capability.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchEngine = m.engine.toLowerCase().includes(q);
      if (!matchName && !matchCap && !matchDesc && !matchEngine) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'production':
        return <Badge variant="glow" style={{ backgroundColor: '#10b98120', borderColor: '#10b981' }}>PRODUCTION</Badge>;
      case 'experimental':
        return <Badge variant="outline" style={{ backgroundColor: '#f59e0b20', borderColor: '#f59e0b' }}>SHADOW / EXP</Badge>;
      case 'benchmark':
      default:
        return <Badge variant="outline" style={{ backgroundColor: '#8b5cf620', borderColor: '#8b5cf6' }}>BENCHMARK</Badge>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Cpu size={30} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>HELIOS AI REGISTRY</Text>
            <Text style={styles.subtitle}>
              32 AI/ML Models across Sentinel Core, Prism, Oracle, Watchtower & Forge
            </Text>
          </View>
        </View>

        {/* Core Principle & Score Fusion Card */}
        <Card glass style={styles.fusionCard}>
          <View style={styles.fusionHeader}>
            <Sparkles size={18} color="#00e5ff" />
            <Text style={styles.fusionTitle}>Model Decision Rule & Score Fusion</Text>
          </View>
          <Text style={styles.fusionPrinciple}>
            "Helios detects. Correlation connects. Prism predicts. Oracle investigates. Watchtower retrieves knowledge. Forge generates remediation."
          </Text>
          <View style={styles.fusionFormulaBox}>
            <Text style={styles.fusionFormulaLabel}>Calibrated Fusion Formula (§21):</Text>
            <Text style={styles.fusionFormulaCode}>
              Final Risk = 0.20×IF + 0.30×DeepLog + 0.20×LogFormer + 0.30×UEBA
            </Text>
          </View>
          <Text style={styles.fusionMeta}>
            Operational scenario (§22): 03:15 credential access combines 4 production model outputs into Risk 0.89 / HIGH ALERT.
          </Text>
        </Card>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Search size={18} color={colors.slate[400]} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search 32 models by name, capability, engine..."
            placeholderTextColor={colors.slate[500]}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Domain Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {DOMAINS.map((dom) => {
            const active = selectedDomain === dom;
            return (
              <Pressable
                key={dom}
                onPress={() => setSelectedDomain(dom)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{dom}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {STATUSES.map((st) => {
            const active = selectedStatus === st;
            return (
              <Pressable
                key={st}
                onPress={() => setSelectedStatus(st)}
                style={[styles.statusChip, active && styles.statusChipActive]}
              >
                <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                  {st.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.counterText}>
          Showing <Text style={{ color: colors.primary, fontWeight: '700' }}>{filteredModels.length}</Text> of {HELIOS_MODELS.length} registered models
        </Text>

        {/* Models List */}
        {filteredModels.map((m) => (
          <Card key={m.id} glass style={styles.modelCard}>
            <View style={styles.modelHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.engineRow}>
                  <Badge variant="glow" style={styles.engineBadge}>{m.engine}</Badge>
                  <Text style={styles.domainText}>{m.domain}</Text>
                </View>
                <Text style={styles.modelName}>{m.name}</Text>
                <Text style={styles.capabilityText}>{m.capability}</Text>
              </View>
              {getStatusBadge(m.status)}
            </View>

            <Text style={styles.descText}>{m.description}</Text>

            <View style={styles.questionBox}>
              <Text style={styles.questionLabel}>Primary Question:</Text>
              <Text style={styles.questionText}>"{m.primaryQuestion}"</Text>
            </View>

            <View style={styles.specsRow}>
              <View style={styles.spec}>
                <Text style={styles.specLabel}>Runtime</Text>
                <Text style={styles.specVal}>{m.runtime}</Text>
              </View>
              <View style={styles.spec}>
                <Text style={styles.specLabel}>Latency</Text>
                <Text style={styles.specVal}>{m.avgLatency}</Text>
              </View>
              <View style={styles.spec}>
                <Text style={styles.specLabel}>Confidence</Text>
                <Text style={styles.specVal}>{(m.confidence * 100).toFixed(0)}%</Text>
              </View>
              <View style={styles.spec}>
                <Text style={styles.specLabel}>Memory</Text>
                <Text style={styles.specVal}>{m.memory}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    color: colors.foreground,
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#00e5ff15',
    borderWidth: 1,
    borderColor: '#00e5ff40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.sansBold,
    color: colors.foreground,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.slate[400],
    marginTop: 2,
  },
  fusionCard: {
    padding: 14,
    marginBottom: 16,
    borderColor: '#00e5ff30',
  },
  fusionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  fusionTitle: {
    color: '#00e5ff',
    fontSize: 13,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.5,
  },
  fusionPrinciple: {
    color: colors.slate[300],
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  fusionFormulaBox: {
    backgroundColor: '#030712',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  fusionFormulaLabel: {
    color: colors.slate[400],
    fontSize: 10,
    fontFamily: fonts.sansBold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fusionFormulaCode: {
    color: '#10b981',
    fontSize: 11,
    fontFamily: fonts.mono,
  },
  fusionMeta: {
    color: colors.slate[400],
    fontSize: 11,
    lineHeight: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.slate[900],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 13,
    padding: 0,
  },
  chipScroll: {
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.slate[900],
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#00e5ff20',
    borderColor: '#00e5ff',
  },
  chipText: {
    color: colors.slate[400],
    fontSize: 12,
    fontFamily: fonts.sansMedium,
  },
  chipTextActive: {
    color: '#00e5ff',
    fontWeight: '700',
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.slate[900],
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  statusChipActive: {
    backgroundColor: '#8b5cf620',
    borderColor: '#8b5cf6',
  },
  statusChipText: {
    color: colors.slate[400],
    fontSize: 10,
    fontFamily: fonts.sansBold,
  },
  statusChipTextActive: {
    color: '#c4b5fd',
  },
  counterText: {
    color: colors.slate[400],
    fontSize: 12,
    marginVertical: 8,
  },
  modelCard: {
    padding: 14,
    marginBottom: 12,
    borderColor: colors.border,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  engineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  engineBadge: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  domainText: {
    color: colors.slate[400],
    fontSize: 11,
    fontFamily: fonts.sansMedium,
  },
  modelName: {
    color: colors.foreground,
    fontSize: 15,
    fontFamily: fonts.sansBold,
  },
  capabilityText: {
    color: '#00e5ff',
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    marginTop: 1,
  },
  descText: {
    color: colors.slate[300],
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  questionBox: {
    backgroundColor: '#030712',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  questionLabel: {
    color: colors.slate[500],
    fontSize: 10,
    fontFamily: fonts.sansBold,
    textTransform: 'uppercase',
  },
  questionText: {
    color: colors.slate[200],
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  spec: {
    alignItems: 'center',
  },
  specLabel: {
    color: colors.slate[500],
    fontSize: 10,
    textTransform: 'uppercase',
  },
  specVal: {
    color: colors.slate[200],
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    marginTop: 2,
  },
});

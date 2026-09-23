import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Sparkles,
  Play,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Trash2,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { simulateNetworkDelay } from '../../lib/api/delay';

interface LogClassifierModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESETS = [
  {
    id: '0315',
    title: '03:15 S3 Exfil',
    source: 'AWS CloudTrail',
    verdict: 'CRITICAL',
    content: `{\n  "eventTime": "2026-03-28T03:15:22Z",\n  "userIdentity": { "arn": "arn:aws:iam::112233445566:user/svc-deployment" },\n  "eventName": "GetObject",\n  "sourceIPAddress": "198.51.100.44 (Tor Exit Node)",\n  "userAgent": "TorBrowser/12.5 aws-sdk-go/v1.44.180",\n  "requestParameters": { "bucketName": "corp-production-secrets-vault" },\n  "consecutiveRequestsInMinute": 428\n}`,
  },
  {
    id: 'k8s',
    title: 'K8s PrivEsc',
    source: 'Kube Audit',
    verdict: 'HIGH',
    content: `{\n  "verb": "create",\n  "requestURI": "/apis/rbac.authorization.k8s.io/v1/clusterrolebindings",\n  "user": { "username": "system:serviceaccount:default:web-frontend-pod-sa" },\n  "roleRef": { "name": "cluster-admin" }\n}`,
  },
  {
    id: 'alb',
    title: 'Normal ALB Flow',
    source: 'AWS ALB',
    verdict: 'BENIGN',
    content: `{\n  "elb": "app/prod-customer-alb/50dc6c495c0c9188",\n  "client_ip": "205.251.192.10",\n  "elb_status_code": 200,\n  "request": "GET https://api.aegis-security.io/v1/health HTTP/2.0",\n  "ssl_protocol": "TLSv1.3"\n}`,
  },
];

export function LogClassifierModal({ visible, onClose }: LogClassifierModalProps) {
  const [logText, setLogText] = useState(PRESETS[0].content);
  const [activePreset, setActivePreset] = useState('0315');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleSelectPreset = (p: typeof PRESETS[0]) => {
    setActivePreset(p.id);
    setLogText(p.content);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!logText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    await simulateNetworkDelay(600, 1100);

    const isBenign = logText.includes('prod-customer-alb') || (logText.includes('200') && !logText.includes('Tor') && !logText.includes('cluster-admin'));
    const isK8s = logText.includes('clusterrolebindings') || logText.includes('cluster-admin');

    if (isBenign) {
      setResult({
        verdict: 'BENIGN',
        score: 0.04,
        confidence: 99.2,
        latencyMs: 9.8,
        accuracy: 99.8,
        precision: 99.4,
        f1: 99.5,
        summary: 'Flow matches verified TLSv1.3 HTTPS ALB ingress profile. Zero anomaly indicators.',
        models: [
          { name: 'Isolation Forest v4', latency: '1.1ms', acc: '98.1%', prec: '96.4%', score: '0.03' },
          { name: 'DeepLog v2 (LSTM)', latency: '2.9ms', acc: '99.2%', prec: '98.1%', score: '0.02' },
          { name: 'LogFormer v1 (Transf.)', latency: '4.8ms', acc: '99.5%', prec: '99.1%', score: '0.05' },
          { name: 'UEBA Behavioral', latency: '1.0ms', acc: '98.9%', prec: '97.8%', score: '0.04' },
        ],
      });
    } else if (isK8s) {
      setResult({
        verdict: 'HIGH',
        score: 0.84,
        confidence: 95.8,
        latencyMs: 13.4,
        accuracy: 99.1,
        precision: 98.2,
        f1: 98.4,
        summary: 'Default ServiceAccount created ClusterRoleBinding to cluster-admin from inside pod network.',
        models: [
          { name: 'Isolation Forest v4', latency: '1.2ms', acc: '98.1%', prec: '96.4%', score: '0.74' },
          { name: 'DeepLog v2 (LSTM)', latency: '3.4ms', acc: '99.2%', prec: '98.1%', score: '0.81' },
          { name: 'LogFormer v1 (Transf.)', latency: '7.1ms', acc: '99.5%', prec: '99.1%', score: '0.89' },
          { name: 'UEBA Behavioral', latency: '1.7ms', acc: '98.9%', prec: '97.8%', score: '0.92' },
        ],
      });
    } else {
      setResult({
        verdict: 'CRITICAL',
        score: 0.89,
        confidence: 97.9,
        latencyMs: 14.8,
        accuracy: 99.4,
        precision: 98.6,
        f1: 98.7,
        summary: 'Off-hours svc-deployment credential login via Tor proxy exit node with 428 req/min S3 exfiltration burst.',
        models: [
          { name: 'Isolation Forest v4', latency: '1.2ms', acc: '98.1%', prec: '96.4%', score: '0.79' },
          { name: 'DeepLog v2 (LSTM)', latency: '3.8ms', acc: '99.2%', prec: '98.1%', score: '0.82' },
          { name: 'LogFormer v1 (Transf.)', latency: '8.4ms', acc: '99.5%', prec: '99.1%', score: '0.88' },
          { name: 'UEBA Behavioral', latency: '2.1ms', acc: '98.9%', prec: '97.8%', score: '0.96' },
        ],
      });
    }

    setIsAnalyzing(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color={colors.primary} />
              <View>
                <Text style={styles.headerTitle}>AI Log Classifier</Text>
                <Text style={styles.headerSubtitle}>Helios Neural Anomaly Inference</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.slate[400]} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Scenario Presets */}
            <Text style={styles.sectionLabel}>PRE-LOADED SCENARIO PRESETS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow}>
              {PRESETS.map((p) => {
                const isSelected = activePreset === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => handleSelectPreset(p)}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                  >
                    <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                      {p.title}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Input Box */}
            <View style={styles.editorBox}>
              <View style={styles.editorBar}>
                <Text style={styles.editorBarText}>Raw Telemetry Stream</Text>
                <Pressable onPress={() => { setLogText(''); setActivePreset(''); setResult(null); }}>
                  <Trash2 size={13} color={colors.danger} />
                </Pressable>
              </View>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={6}
                value={logText}
                onChangeText={(t) => { setLogText(t); setActivePreset(''); setResult(null); }}
                placeholder="Paste JSON or raw telemetry log..."
                placeholderTextColor={colors.slate[600]}
                autoCapitalize="none"
              />
            </View>

            {/* Run Button */}
            <Pressable
              onPress={handleAnalyze}
              disabled={isAnalyzing || !logText.trim()}
              style={[styles.runBtn, isAnalyzing && { opacity: 0.6 }]}
            >
              {isAnalyzing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="#030712" />
                  <Text style={styles.runBtnText}>Running Helios Inference...</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Play size={14} color="#030712" />
                  <Text style={styles.runBtnText}>Analyze &amp; Classify Log</Text>
                </View>
              )}
            </Pressable>

            {/* Results Section */}
            {result && (
              <View style={styles.resultsContainer}>
                {/* Verdict Card */}
                <View
                  style={[
                    styles.verdictCard,
                    result.verdict === 'CRITICAL'
                      ? styles.verdictCritical
                      : result.verdict === 'HIGH'
                      ? styles.verdictHigh
                      : styles.verdictBenign,
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {result.verdict === 'CRITICAL' && <ShieldAlert size={16} color={colors.danger} />}
                      {result.verdict === 'HIGH' && <AlertTriangle size={16} color={colors.warning} />}
                      {result.verdict === 'BENIGN' && <ShieldCheck size={16} color={colors.success} />}
                      <Text
                        style={[
                          styles.verdictText,
                          {
                            color:
                              result.verdict === 'CRITICAL'
                                ? colors.danger
                                : result.verdict === 'HIGH'
                                ? colors.warning
                                : colors.success,
                          },
                        ]}
                      >
                        VERDICT: {result.verdict}
                      </Text>
                    </View>
                    <Text style={styles.confText}>{result.confidence}% Confidence</Text>
                  </View>
                  <Text style={styles.summaryText}>{result.summary}</Text>
                  <Text style={styles.formulaText}>
                    Fused Score: {Math.round(result.score * 100)}/100 (4-Way Helios Fusion)
                  </Text>
                </View>

                {/* Performance Metrics Strip */}
                <Text style={styles.sectionLabel}>CLASSIFIER PERFORMANCE BENCHMARKS</Text>
                <View style={styles.metricGrid}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Total Latency</Text>
                    <Text style={[styles.metricVal, { color: colors.primary }]}>{result.latencyMs} ms</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Accuracy</Text>
                    <Text style={[styles.metricVal, { color: colors.success }]}>{result.accuracy}%</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Precision</Text>
                    <Text style={[styles.metricVal, { color: colors.accent }]}>{result.precision}%</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>F1 Score</Text>
                    <Text style={[styles.metricVal, { color: colors.warning }]}>{result.f1}%</Text>
                  </View>
                </View>

                {/* Models Used */}
                <Text style={styles.sectionLabel}>MODELS DEPLOYED &amp; SCORES</Text>
                <View style={{ gap: 8 }}>
                  {result.models.map((m: any, i: number) => (
                    <View key={i} style={styles.modelRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modelName}>{m.name}</Text>
                        <Text style={styles.modelSub}>
                          Latency: {m.latency} • Acc: {m.acc} • Prec: {m.prec}
                        </Text>
                      </View>
                      <View style={styles.modelScoreBadge}>
                        <Text style={styles.modelScoreText}>{m.score}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '90%',
    minHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.monoBold,
    color: colors.foreground,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.slate[400],
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.slate[900],
  },
  body: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.slate[400],
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  presetRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.slate[900],
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  presetChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.slate[300],
  },
  presetChipTextActive: {
    color: colors.primary,
    fontFamily: fonts.monoBold,
  },
  editorBox: {
    backgroundColor: colors.slate[950],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  editorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate[900],
  },
  editorBarText: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.slate[400],
  },
  textInput: {
    padding: 12,
    color: colors.slate[200],
    fontFamily: fonts.mono,
    fontSize: 11,
    textAlignVertical: 'top',
    minHeight: 120,
    maxHeight: 180,
  },
  runBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  runBtnText: {
    fontSize: 13,
    fontFamily: fonts.monoBold,
    color: '#030712',
  },
  resultsContainer: {
    marginTop: 16,
  },
  verdictCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  verdictCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  verdictHigh: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  verdictBenign: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  verdictText: {
    fontSize: 13,
    fontFamily: fonts.monoBold,
  },
  confText: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.slate[400],
  },
  summaryText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.slate[300],
    marginTop: 6,
    lineHeight: 18,
  },
  formulaText: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.slate[500],
    marginTop: 6,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metricBox: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.slate[950],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontFamily: fonts.mono,
    color: colors.slate[500],
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 14,
    fontFamily: fonts.monoBold,
  },
  modelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.slate[950],
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modelName: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.slate[200],
  },
  modelSub: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.slate[400],
    marginTop: 2,
  },
  modelScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.slate[900],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modelScoreText: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.primary,
  },
});


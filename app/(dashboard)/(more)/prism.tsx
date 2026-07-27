import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Network, Globe, AlertCircle, UserCheck, Database, FileText, ArrowRight } from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const PRISM_NODES = [
  { id: 'ip_1', label: '198.51.100.42', type: 'THREAT IP', category: 'SOURCE IP', status: 'CRITICAL', riskScore: 99 },
  { id: 'alert_1', label: 'ConsoleLogin', type: 'INCIDENT', category: 'TRIGGER_ALERT', status: 'HIGH', riskScore: 94 },
  { id: 'user_1', label: 'dev-role', type: 'USER IAM', category: 'IAM USER', status: 'SUSPICIOUS', riskScore: 88 },
  { id: 's3_1', label: 'secrets-bucket', type: 'RESOURCE S3', category: 'ASSET S3', status: 'TARGET', riskScore: 92 },
];

const FORENSIC_LOGS = [
  { time: '18:42:01', text: 'ConsoleLogin event captured from IP 198.51.100.42', highlight: false },
  { time: '18:42:05', text: 'Auth evaluator matches IP range with proxy network', highlight: false },
  { time: '18:42:07', text: 'Incident generated. Sentinel triggers block policies.', highlight: true },
];

export default function PrismScreen() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(PRISM_NODES[1]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'THREAT IP':
        return <Globe size={18} color={colors.danger} />;
      case 'INCIDENT':
        return <AlertCircle size={18} color="#00e5ff" />;
      case 'USER IAM':
        return <UserCheck size={18} color="#3b82f6" />;
      case 'RESOURCE S3':
      default:
        return <Database size={18} color="#f59e0b" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Network size={28} color="#00e5ff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Prism</Text>
            <Text style={styles.subtitle}>
              Interactive forensic investigation and alert link analysis
            </Text>
          </View>
        </View>

        {/* Investigation Visualizer Graph */}
        <Card glass glow glowColor="rgba(0, 229, 255, 0.4)" style={styles.canvasCard}>
          <Text style={styles.sectionHeading}>INVESTIGATION VISUALIZER</Text>
          
          <View style={styles.nodesGrid}>
            {PRISM_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <Pressable
                  key={node.id}
                  onPress={() => setSelectedNode(node)}
                  style={[styles.nodeItem, isSelected && styles.selectedNodeItem]}
                >
                  {getNodeIcon(node.type)}
                  <Text style={styles.categoryText}>{node.category}</Text>
                  <Text style={styles.nodeLabel}>{node.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>INCIDENT</Text>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>THREAT IP</Text>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>USER IAM</Text>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>RESOURCE S3</Text>
          </View>
        </Card>

        {/* Selected Node Details */}
        <Card glass style={styles.detailCard}>
          <Text style={styles.sectionHeading}>NODE DETAILS</Text>

          <View style={styles.alertHeader}>
            <Badge variant="destructive">INCIDENT TRIGGER</Badge>
            <Text style={styles.alertTitle}>ConsoleLogin Anomaly</Text>
            <Text style={styles.alertSub}>
              Unusual console login attempt from a proxy range outside regular user geolocations.
            </Text>
          </View>

          <View style={styles.propertiesBox}>
            <Text style={styles.propLabel}>PROPERTIES</Text>
            <View style={styles.propRow}>
              <Text style={styles.propKey}>Event ID:</Text>
              <Text style={styles.propVal}>console-login-773a</Text>
            </View>
            <View style={styles.propRow}>
              <Text style={styles.propKey}>Time:</Text>
              <Text style={styles.propVal}>2026-07-14 18:42:01</Text>
            </View>
            <View style={styles.propRow}>
              <Text style={styles.propKey}>Source API:</Text>
              <Text style={styles.propVal}>AWS CloudTrail</Text>
            </View>
          </View>

          <Pressable style={styles.queryBtn}>
            <Text style={styles.queryBtnText}>QUERY ASSOCIATED EVENTS</Text>
            <ArrowRight size={14} color="#030712" />
          </Pressable>
        </Card>

        {/* Forensic Logs */}
        <Card glass style={styles.logsCard}>
          <Text style={styles.sectionHeading}>FORENSIC LOGS</Text>

          <View style={styles.timelineList}>
            {FORENSIC_LOGS.map((log, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <FileText size={14} color={log.highlight ? colors.primary : colors.slate[400]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.timelineTime}>{log.time}</Text>
                  <Text style={[styles.timelineText, log.highlight && styles.highlightText]}>
                    {log.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  container: { padding: 16, paddingBottom: 40, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 12, color: colors.slate[400], marginTop: 2 },
  canvasCard: { padding: 16 },
  sectionHeading: { fontSize: 12, fontWeight: '700', color: colors.foreground, fontFamily: fonts.mono, letterSpacing: 0.5, marginBottom: 10 },
  nodesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  nodeItem: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
  },
  selectedNodeItem: { borderColor: '#00e5ff', backgroundColor: 'rgba(0, 229, 255, 0.12)' },
  categoryText: { fontFamily: fonts.mono, fontSize: 9, color: colors.slate[400], fontWeight: '700' },
  nodeLabel: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.foreground, textAlign: 'center' },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)' },
  legendDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00e5ff' },
  legendText: { fontFamily: fonts.mono, fontSize: 9, color: colors.slate[400], marginRight: 6 },
  detailCard: { padding: 16, gap: 12 },
  alertHeader: { gap: 4 },
  alertTitle: { fontSize: 16, fontWeight: '800', color: colors.foreground, marginTop: 4 },
  alertSub: { fontSize: 12, color: colors.slate[300], lineHeight: 18 },
  propertiesBox: { backgroundColor: 'rgba(255, 255, 255, 0.02)', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, gap: 8 },
  propLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400], fontWeight: '700' },
  propRow: { flexDirection: 'row', justifyContent: 'space-between' },
  propKey: { fontSize: 12, color: colors.slate[400] },
  propVal: { fontFamily: fonts.mono, fontSize: 12, color: colors.foreground, fontWeight: '600' },
  queryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00e5ff',
    paddingVertical: 10,
    borderRadius: 10,
  },
  queryBtnText: { color: '#030712', fontSize: 12, fontWeight: '800', fontFamily: fonts.mono },
  logsCard: { padding: 16 },
  timelineList: { gap: 12, marginTop: 4 },
  timelineItem: { flexDirection: 'row', gap: 10 },
  timelineTime: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400] },
  timelineText: { fontSize: 12, color: colors.slate[300], marginTop: 1 },
  highlightText: { color: colors.primary, fontWeight: '700' },
});


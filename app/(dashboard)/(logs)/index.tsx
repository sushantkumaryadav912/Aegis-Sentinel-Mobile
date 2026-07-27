import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeInDown,
} from 'react-native-reanimated';
import {
  Search,
  Network,
  AlertCircle,
  FileText,
  TrendingUp,
  ChevronRight,
  Clock,
  UserCheck,
  Target,
  Cpu,
  ExternalLink,
  ShieldAlert,
  Database,
  BarChart2,
} from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { SeverityBadge } from '../../../src/components/alerts/Badges';
import { ModuleHeader } from '../../../src/components/layout/ModuleHeader';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

// ─── Mock Prism Incidents ───────────────────────────────────────────────────
const PRISM_INCIDENTS = [
  {
    id: 'INC-2026-088',
    title: 'Console Login Anomaly — Proxy IP Chain Detected',
    severity: 'CRITICAL' as const,
    status: 'ACTIVE',
    mitreTactic: 'Initial Access',
    mitreId: 'T1078',
    blastRadius: 'HIGH',
    assignee: 'Sushant Kumar',
    affectedAssets: 4,
    timeAgo: '18 mins ago',
    predictionRisk: 97,
    aiSummary:
      'Investigation AI correlates 3 CloudTrail events. Proxy IP chain traced to Tor exit node IOC-198. Secrets bucket access imminent.',
  },
  {
    id: 'INC-2026-081',
    title: 'Data Exfiltration Attempt — S3 Secrets Bucket',
    severity: 'CRITICAL' as const,
    status: 'INVESTIGATING',
    mitreTactic: 'Exfiltration',
    mitreId: 'T1537',
    blastRadius: 'CRITICAL',
    assignee: 'Jane Doe',
    affectedAssets: 7,
    timeAgo: '45 mins ago',
    predictionRisk: 99,
    aiSummary:
      'Prediction AI forecasts 99% probability of lateral movement to production RDS within 12 minutes without containment.',
  },
  {
    id: 'INC-2026-074',
    title: 'IAM Privilege Escalation via AssumeRole Chain',
    severity: 'HIGH' as const,
    status: 'TRIAGED',
    mitreTactic: 'Privilege Escalation',
    mitreId: 'T1548',
    blastRadius: 'MEDIUM',
    assignee: 'Unassigned',
    affectedAssets: 2,
    timeAgo: '2 hours ago',
    predictionRisk: 78,
    aiSummary:
      'DevOps-Temp role assumed by unknown entity at 18:42. AssumeRole chain terminates at prod-finance-vault service.',
  },
  {
    id: 'INC-2026-059',
    title: 'Kubernetes Container Breakout Warning',
    severity: 'HIGH' as const,
    status: 'RESOLVED',
    mitreTactic: 'Execution',
    mitreId: 'T1610',
    blastRadius: 'LOW',
    assignee: 'Sushant Kumar',
    affectedAssets: 1,
    timeAgo: '1 day ago',
    predictionRisk: 20,
    aiSummary:
      'Contained. Pod terminated and namespace isolated by Forge Remediation AI. No lateral movement detected.',
  },
];

const FORENSIC_TIMELINE = [
  { time: '18:42:01', event: 'ConsoleLogin detected from 198.51.100.42', tag: 'SENTINEL', critical: false },
  { time: '18:42:05', event: 'IP matched against Watchtower IoC — Tor Exit Node', tag: 'WATCHTOWER', critical: false },
  { time: '18:42:07', event: 'Incident INC-2026-088 created by Sentinel Core', tag: 'SENTINEL', critical: false },
  { time: '18:42:09', event: 'Investigation AI begins correlation sweep', tag: 'PRISM', critical: false },
  { time: '18:42:14', event: 'dev-role assumed by attacker. IAM mutation detected.', tag: 'PRISM', critical: true },
  { time: '18:42:18', event: 'secrets-bucket S3 GetObject calls begin (47 in 4s)', tag: 'PRISM', critical: true },
  { time: '18:42:22', event: 'Prediction AI: 99% exfil probability in 12 minutes', tag: 'PREDICTION', critical: true },
  { time: '18:42:28', event: 'Forge Remediation AI notified. Awaiting approval.', tag: 'FORGE', critical: false },
];

const PREDICTIONS = [
  {
    id: 'pred_1',
    title: 'Lateral Movement to RDS Production',
    probability: 99,
    timeframe: '< 12 minutes',
    severity: 'CRITICAL' as const,
    recommendation: 'Immediately isolate dev-role. Revoke all active STS tokens.',
  },
  {
    id: 'pred_2',
    title: 'Data Exfiltration Volume Spike',
    probability: 87,
    timeframe: '< 30 minutes',
    severity: 'HIGH' as const,
    recommendation: 'Apply S3 bucket policy restricting GetObject to trusted CIDR ranges only.',
  },
  {
    id: 'pred_3',
    title: 'Additional IAM Key Creation Attempt',
    probability: 72,
    timeframe: '< 1 hour',
    severity: 'HIGH' as const,
    recommendation: 'Enable IAM Access Analyzer and enforce SCP to deny CreateAccessKey.',
  },
];

// ─── Tag Colour Helper ────────────────────────────────────────────────────────
function getTagColor(tag: string) {
  switch (tag) {
    case 'SENTINEL': return colors.primary;
    case 'WATCHTOWER': return '#8b5cf6';
    case 'PRISM': return '#3b82f6';
    case 'PREDICTION': return colors.warning;
    case 'FORGE': return '#10b981';
    default: return colors.slate[400];
  }
}

// ─── Blast Radius Colour ──────────────────────────────────────────────────────
function getBlastColor(level: string) {
  switch (level) {
    case 'CRITICAL': return colors.danger;
    case 'HIGH': return colors.warning;
    case 'MEDIUM': return colors.primary;
    default: return colors.success;
  }
}

type ActiveTab = 'INCIDENTS' | 'TIMELINE' | 'PREDICTIONS';

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PrismScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('INCIDENTS');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(PRISM_INCIDENTS[0].id);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const filteredIncidents = PRISM_INCIDENTS.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.mitreTactic.toLowerCase().includes(search.toLowerCase())
  );

  const selectedIncident = PRISM_INCIDENTS.find((i) => i.id === selectedIncidentId) ?? PRISM_INCIDENTS[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Module Header */}
        <View style={styles.headerPad}>
          <ModuleHeader
            module="PRISM"
            category="Investigation Engine"
            aiEngine="Investigation AI + Prediction AI"
            engineColor="#3b82f6"
            action={
              <Pressable
                style={styles.workspaceBtn}
                onPress={() => router.push('/(dashboard)/(more)/prism' as any)}
              >
                <Network size={13} color={colors.primary} />
                <Text style={styles.workspaceBtnText}>Graph</Text>
              </Pressable>
            }
          />

          {/* Tab Switcher */}
          <View style={styles.tabRow}>
            {(['INCIDENTS', 'TIMELINE', 'PREDICTIONS'] as ActiveTab[]).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── INCIDENTS TAB ── */}
        {activeTab === 'INCIDENTS' && (
          <>
            {/* Search */}
            <View style={styles.searchWrapper}>
              <Search size={16} color={colors.slate[400]} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search incidents, MITRE tactic, ID..."
                placeholderTextColor={colors.slate[500]}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={filteredIncidents}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
              }
              contentContainerStyle={styles.listPad}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
                  <Card
                    glass
                    glow={item.status !== 'RESOLVED'}
                    glowColor={item.status === 'ACTIVE' ? 'rgba(239,68,68,0.5)' : 'rgba(0,229,255,0.25)'}
                    onPress={() => {
                      setSelectedIncidentId(item.id);
                      setActiveTab('TIMELINE');
                    }}
                  >
                    <View style={styles.incidentCard}>
                      {/* Header row */}
                      <View style={styles.incidentHeader}>
                        <Text style={styles.incidentId}>{item.id}</Text>
                        <View style={styles.incidentBadges}>
                          <SeverityBadge level={item.severity} />
                          <View style={[styles.statusPill, item.status === 'ACTIVE' && styles.activePill]}>
                            <Text style={[styles.statusPillText, item.status === 'ACTIVE' && styles.activePillText]}>
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Title */}
                      <Text style={styles.incidentTitle}>{item.title}</Text>

                      {/* AI Summary */}
                      <View style={styles.aiSummaryBox}>
                        <Cpu size={11} color={colors.primary} />
                        <Text style={styles.aiSummaryText} numberOfLines={2}>{item.aiSummary}</Text>
                      </View>

                      {/* Meta row */}
                      <View style={styles.incidentMeta}>
                        <View style={styles.metaChip}>
                          <Target size={11} color={colors.slate[400]} />
                          <Text style={styles.metaChipText}>{item.mitreTactic} · {item.mitreId}</Text>
                        </View>
                        <View style={[styles.blastChip, { borderColor: getBlastColor(item.blastRadius) }]}>
                          <Text style={[styles.blastText, { color: getBlastColor(item.blastRadius) }]}>
                            BLAST: {item.blastRadius}
                          </Text>
                        </View>
                      </View>

                      {/* Footer */}
                      <View style={styles.incidentFooter}>
                        <View style={styles.footerLeft}>
                          <UserCheck size={12} color={colors.slate[400]} />
                          <Text style={styles.footerText}>{item.assignee}</Text>
                          <Text style={styles.footerDivider}>·</Text>
                          <Database size={12} color={colors.slate[400]} />
                          <Text style={styles.footerText}>{item.affectedAssets} assets</Text>
                        </View>
                        <View style={styles.footerRight}>
                          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                          <ChevronRight size={14} color={colors.slate[500]} />
                        </View>
                      </View>
                    </View>
                  </Card>
                </Animated.View>
              )}
            />
          </>
        )}

        {/* ── TIMELINE TAB ── */}
        {activeTab === 'TIMELINE' && (
          <ScrollView
            contentContainerStyle={styles.listPad}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            {/* Selected Incident pill */}
            <Pressable
              style={styles.selectedIncidentPill}
              onPress={() => setActiveTab('INCIDENTS')}
            >
              <AlertCircle size={13} color={colors.danger} />
              <Text style={styles.selectedIncidentText}>{selectedIncident.id} — {selectedIncident.title}</Text>
              <ChevronRight size={12} color={colors.slate[400]} />
            </Pressable>

            <Card glass glow glowColor="rgba(59,130,246,0.35)" style={styles.timelineCard}>
              <View style={styles.timelineHeader}>
                <Clock size={16} color="#3b82f6" />
                <Text style={styles.timelineTitle}>FORENSIC TIMELINE</Text>
              </View>
              <Text style={styles.timelineSubtitle}>Investigation AI • Chronological Event Reconstruction</Text>

              <View style={styles.timelineList}>
                {FORENSIC_TIMELINE.map((entry, idx) => (
                  <Animated.View
                    key={idx}
                    entering={FadeInDown.delay(idx * 80).springify()}
                    style={styles.timelineRow}
                  >
                    <View style={styles.timelineLeft}>
                      <Text style={styles.timelineTime}>{entry.time}</Text>
                      {idx < FORENSIC_TIMELINE.length - 1 && <View style={styles.timelineConnector} />}
                    </View>
                    <View style={[styles.timelineDot, entry.critical && styles.timelineDotCritical]} />
                    <View style={styles.timelineContent}>
                      <View style={[styles.timelineTag, { borderColor: getTagColor(entry.tag) + '60' }]}>
                        <Text style={[styles.timelineTagText, { color: getTagColor(entry.tag) }]}>
                          {entry.tag}
                        </Text>
                      </View>
                      <Text style={[styles.timelineEventText, entry.critical && styles.criticalText]}>
                        {entry.event}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Card>

            {/* Open full investigation workspace */}
            <Pressable
              style={styles.openWorkspaceBtn}
              onPress={() => router.push('/(dashboard)/(more)/prism' as any)}
            >
              <Network size={16} color="#030712" />
              <Text style={styles.openWorkspaceBtnText}>OPEN INVESTIGATION WORKSPACE</Text>
              <ExternalLink size={14} color="#030712" />
            </Pressable>
          </ScrollView>
        )}

        {/* ── PREDICTIONS TAB ── */}
        {activeTab === 'PREDICTIONS' && (
          <ScrollView
            contentContainerStyle={styles.listPad}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            {/* AI Banner */}
            <Card glass glow glowColor="rgba(245,158,11,0.4)" style={styles.predictionBanner}>
              <View style={styles.predBannerRow}>
                <BarChart2 size={20} color={colors.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.predBannerTitle}>PREDICTION AI — ACTIVE</Text>
                  <Text style={styles.predBannerSub}>
                    Forecasting attack progression for {PRISM_INCIDENTS.filter(i => i.status !== 'RESOLVED').length} active incidents
                  </Text>
                </View>
              </View>
            </Card>

            {PREDICTIONS.map((pred, idx) => (
              <Animated.View key={pred.id} entering={FadeInDown.delay(idx * 80).springify()}>
                <Card glass glow glowColor={pred.severity === 'CRITICAL' ? 'rgba(239,68,68,0.45)' : 'rgba(245,158,11,0.35)'} style={styles.predCard}>
                  <View style={styles.predHeader}>
                    <TrendingUp size={16} color={pred.severity === 'CRITICAL' ? colors.danger : colors.warning} />
                    <Text style={styles.predProbability}>
                      {pred.probability}%
                    </Text>
                    <SeverityBadge level={pred.severity} />
                  </View>

                  <Text style={styles.predTitle}>{pred.title}</Text>
                  <View style={styles.predTimeframeRow}>
                    <Clock size={12} color={colors.slate[400]} />
                    <Text style={styles.predTimeframe}>Timeframe: {pred.timeframe}</Text>
                  </View>

                  <View style={styles.predRecommendation}>
                    <ShieldAlert size={13} color={colors.primary} />
                    <Text style={styles.predRecommendationText}>{pred.recommendation}</Text>
                  </View>

                  <View style={styles.predActions}>
                    <Pressable
                      style={styles.predActionBtn}
                      onPress={() => router.push('/(dashboard)/(more)/workflows' as any)}
                    >
                      <Text style={styles.predActionBtnText}>TRIGGER FORGE PLAYBOOK</Text>
                    </Pressable>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  headerPad: { paddingHorizontal: 16, paddingTop: 12 },

  workspaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  workspaceBtnText: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', color: colors.primary },

  tabRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.4)',
  },
  tabText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate[500],
  },
  tabTextActive: { color: '#3b82f6' },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1633',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.foreground, fontSize: 13, height: '100%' },

  listPad: { padding: 16, paddingBottom: 24, gap: 10 },

  // Incident card
  incidentCard: { gap: 10 },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incidentId: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.slate[400] },
  incidentBadges: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activePill: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  statusPillText: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', color: colors.slate[400] },
  activePillText: { color: colors.danger },
  incidentTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground, lineHeight: 20 },
  aiSummaryBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0,229,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.15)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'flex-start',
  },
  aiSummaryText: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[300], flex: 1, lineHeight: 15 },
  incidentMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flex: 1,
  },
  metaChipText: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', color: '#3b82f6' },
  blastChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  blastText: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '700' },
  incidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerText: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400] },
  footerDivider: { color: colors.slate[600], fontSize: 10 },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeAgo: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[500] },

  // Timeline
  selectedIncidentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
  selectedIncidentText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.foreground,
    flex: 1,
    fontWeight: '600',
  },
  timelineCard: { padding: 16 },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  timelineTitle: { fontFamily: fonts.mono, fontSize: 12, fontWeight: '700', color: colors.foreground, letterSpacing: 0.5 },
  timelineSubtitle: { fontFamily: fonts.mono, fontSize: 9, color: colors.slate[500], marginBottom: 16 },
  timelineList: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 48 },
  timelineLeft: { width: 54, alignItems: 'center', paddingTop: 2 },
  timelineTime: { fontFamily: fonts.mono, fontSize: 9, color: colors.slate[400], lineHeight: 14 },
  timelineConnector: { width: 1, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.slate[700],
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 3,
    marginHorizontal: 8,
  },
  timelineDotCritical: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginBottom: 4,
  },
  timelineTagText: { fontFamily: fonts.mono, fontSize: 8, fontWeight: '700' },
  timelineEventText: { fontSize: 12, color: colors.slate[300], lineHeight: 17 },
  criticalText: { color: colors.foreground, fontWeight: '700' },

  openWorkspaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 4,
  },
  openWorkspaceBtnText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    color: '#030712',
  },

  // Predictions
  predictionBanner: { padding: 14, marginBottom: 4 },
  predBannerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  predBannerTitle: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '800', color: colors.warning, letterSpacing: 0.5 },
  predBannerSub: { fontSize: 11, color: colors.slate[400], marginTop: 1 },

  predCard: { padding: 16 },
  predHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  predProbability: {
    fontFamily: fonts.monoBold,
    fontSize: 22,
    fontWeight: '900',
    color: colors.foreground,
    flex: 1,
  },
  predTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground, lineHeight: 20, marginBottom: 6 },
  predTimeframeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  predTimeframe: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[400] },
  predRecommendation: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0,229,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.15)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  predRecommendationText: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[300], flex: 1, lineHeight: 15 },
  predActions: { flexDirection: 'row' },
  predActionBtn: {
    backgroundColor: 'rgba(0,229,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.35)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  predActionBtnText: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '800', color: colors.primary },
});

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cloud,
  Sparkles,
  TrendingUp,
  Server,
  Activity,
  Lock,
  Cpu,
  Award,
  Network,
  GitBranch,
  Eye,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDashboard } from '../../../src/hooks/useDashboard';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { AlertCard } from '../../../src/components/alerts/AlertCard';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

// ─── Static config ─────────────────────────────────────────────────────────
const CLOUD_PROVIDERS = [
  { name: 'AWS Cloud', nodes: '421 Nodes', health: '99.8%', color: '#f59e0b' },
  { name: 'Azure Core', nodes: '184 Assets', health: '100%', color: '#3b82f6' },
  { name: 'Google Cloud', nodes: '96 Clusters', health: '98.5%', color: '#ea4335' },
  { name: 'Kubernetes', nodes: '64 Clusters', health: '100%', color: '#00e5ff' },
];

const AI_ENGINES = [
  { label: 'Detection AI', module: 'Sentinel Core', status: 'ONLINE', color: colors.primary },
  { label: 'Knowledge AI', module: 'Watchtower', status: 'ONLINE', color: '#8b5cf6' },
  { label: 'Investigation AI', module: 'Prism', status: 'ONLINE', color: '#3b82f6' },
  { label: 'Prediction AI', module: 'Prism', status: 'ONLINE', color: colors.warning },
  { label: 'Remediation AI', module: 'Forge', status: 'ONLINE', color: '#10b981' },
  { label: 'Oracle', module: 'Copilot', status: 'ONLINE', color: colors.primary },
];

const COMPLIANCE_ITEMS = [
  { label: 'SOC 2 Type II', status: 'PASS', color: '#10b981' },
  { label: 'ISO 27001', status: 'PASS', color: '#10b981' },
  { label: 'FedRAMP High', status: 'PASS', color: '#10b981' },
  { label: 'HIPAA', status: 'PASS', color: '#10b981' },
];

const ORACLE_INSIGHTS = [
  { text: 'ConsoleLogin anomaly from proxy IP — investigate in Prism immediately', severity: 'CRITICAL' },
  { text: 'GCP Pub/Sub collector degraded — 480ms buffer lag. Check Pulse.', severity: 'HIGH' },
  { text: 'Forge has 1 pending approval: AWS IAM Emergency Revoke playbook', severity: 'MEDIUM' },
];

// ─── Animated Engine Status Dot ─────────────────────────────────────────────
function EngineDot({ color }: { color: string }) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.2, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.engineDot, { backgroundColor: color }, style]} />;
}

// ─── Animated Cloud Status Dot ───────────────────────────────────────────────
function CloudStatusDot({ color }: { color: string }) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.cloudDot, { backgroundColor: color }, style]} />;
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function OverviewScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  const securityScore = 92;

  // Scan line animation
  const scanY = useSharedValue(-2);
  useEffect(() => {
    scanY.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value * 140 }],
    opacity: 0.35,
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── Atlas Header ── */}
        <Animated.View entering={FadeIn.duration(500)}>
          <View style={styles.atlasHeader}>
            <View>
              <View style={styles.atlasTagRow}>
                <Activity size={10} color={colors.primary} />
                <Text style={styles.atlasTag}>EXECUTIVE DASHBOARD</Text>
              </View>
              <Text style={styles.atlasTitle}>ATLAS</Text>
              <Text style={styles.atlasSub}>Real-Time Multi-Cloud Security Posture</Text>
            </View>
            <Badge variant="glow">
              <Activity size={10} color={colors.primary} /> LIVE
            </Badge>
          </View>
        </Animated.View>

        {/* ── Hero Security Posture ── */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <Card glass glow glowColor="rgba(0, 229, 255, 0.4)" style={styles.scoreHeroCard}>
            <LinearGradient
              colors={['rgba(0, 229, 255, 0.12)', 'rgba(37, 99, 235, 0.05)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scoreHeroBg}
            >
              {/* Scan line overlay */}
              <Animated.View style={[styles.scanLine, scanStyle]} />

              <View style={styles.scoreTopRow}>
                <View>
                  <View style={styles.pillBadge}>
                    <ShieldCheck size={14} color={colors.success} />
                    <Text style={styles.pillText}>POSTURE OPTIMAL</Text>
                  </View>
                  <Text style={styles.heroTitle}>Global Security Score</Text>
                  <Text style={styles.heroSub}>Aegis AI Threat & Compliance Index</Text>
                </View>

                <View style={styles.scoreCircleWrapper}>
                  <LinearGradient colors={['#00e5ff', '#2563eb']} style={styles.scoreCircleGradient}>
                    <View style={styles.scoreCircleInner}>
                      <Text style={styles.scoreNumber}>{securityScore}</Text>
                      <Text style={styles.scoreTotal}>/100</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.scoreFooterGrid}>
                <View style={styles.scoreFooterItem}>
                  <Text style={styles.scoreFooterValue}>+3.4%</Text>
                  <Text style={styles.scoreFooterLabel}>24h Posture Delta</Text>
                </View>
                <View style={styles.scoreDivider} />
                <View style={styles.scoreFooterItem}>
                  <Text style={[styles.scoreFooterValue, { color: colors.success }]}>99.94%</Text>
                  <Text style={styles.scoreFooterLabel}>Pipeline Health</Text>
                </View>
                <View style={styles.scoreDivider} />
                <View style={styles.scoreFooterItem}>
                  <Text style={[styles.scoreFooterValue, { color: colors.primary }]}>{'< 42ms'}</Text>
                  <Text style={styles.scoreFooterLabel}>Mean Detect Latency</Text>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* ── KPI Metrics Grid ── */}
        {isLoading || !data ? (
          <View style={styles.metricsGrid}>
            <Skeleton height={90} width="48%" />
            <Skeleton height={90} width="48%" />
            <Skeleton height={90} width="48%" />
            <Skeleton height={90} width="48%" />
          </View>
        ) : (
          <View style={styles.metricsGrid}>
            {[
              { label: 'TOTAL ALERTS', value: data.totalAlerts.toLocaleString(), icon: <ShieldAlert size={16} color={colors.primary} />, color: colors.foreground, glow: 'rgba(0, 229, 255, 0.3)', meta: 'All Ingested Logs' },
              { label: 'CRITICAL', value: String(data.criticalAlerts), icon: <AlertTriangle size={16} color={colors.danger} />, color: colors.danger, glow: 'rgba(239, 68, 68, 0.5)', meta: 'Requires Action' },
              { label: 'ACTIVE CASES', value: String(data.openAlerts), icon: <Clock size={16} color={colors.warning} />, color: colors.warning, glow: 'rgba(245, 158, 11, 0.4)', meta: 'Under Investigation' },
              { label: 'RESOLVED', value: data.resolvedAlerts.toLocaleString(), icon: <CheckCircle size={16} color={colors.success} />, color: colors.success, glow: 'rgba(16, 185, 129, 0.4)', meta: 'SOAR Auto-Mitigated' },
            ].map((m, idx) => (
              <Animated.View key={m.label} entering={FadeInDown.delay(100 + idx * 60).springify()} style={{ width: '48%' }}>
                <Card glass glow glowColor={m.glow} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{m.label}</Text>
                    {m.icon}
                  </View>
                  <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.metricMeta}>{m.meta}</Text>
                </Card>
              </Animated.View>
            ))}
          </View>
        )}

        {/* ── AI Engine Status (Platform Health) ── */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card glass style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Cpu size={18} color={colors.primary} />
              <Text style={styles.sectionTitleNoMargin}>Platform AI Health</Text>
              <View style={styles.allOnlinePill}>
                <Text style={styles.allOnlineText}>ALL SYSTEMS ONLINE</Text>
              </View>
            </View>
            <View style={styles.engineGrid}>
              {AI_ENGINES.map((engine) => (
                <View key={engine.label} style={styles.engineItem}>
                  <EngineDot color={engine.color} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.engineLabel}>{engine.label}</Text>
                    <Text style={styles.engineModule}>{engine.module}</Text>
                  </View>
                  <Text style={[styles.engineStatus, { color: engine.color }]}>{engine.status}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* ── Oracle AI Insights ── */}
        <Animated.View entering={FadeInDown.delay(240).springify()}>
          <Card glass glow glowColor="rgba(139, 92, 246, 0.3)" style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Sparkles size={18} color="#8b5cf6" />
              <Text style={styles.sectionTitleNoMargin}>Oracle AI Insights</Text>
              <Pressable onPress={() => router.push('/(dashboard)/(oracle)')} style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>Ask Oracle</Text>
                <ChevronRight size={14} color={colors.primary} />
              </Pressable>
            </View>
            <View style={styles.insightsList}>
              {ORACLE_INSIGHTS.map((insight, idx) => (
                <View key={idx} style={styles.insightRow}>
                  <View style={[styles.insightDot, {
                    backgroundColor: insight.severity === 'CRITICAL' ? colors.danger :
                      insight.severity === 'HIGH' ? colors.warning : colors.primary
                  }]} />
                  <Text style={styles.insightText}>{insight.text}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* ── Cloud Ecosystem ── */}
        <Animated.View entering={FadeInDown.delay(280).springify()}>
          <Card glass style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Server size={18} color={colors.primary} />
              <Text style={styles.sectionTitleNoMargin}>Protected Cloud Ecosystem</Text>
            </View>
            <View style={styles.cloudGrid}>
              {CLOUD_PROVIDERS.map((item) => (
                <View key={item.name} style={styles.cloudCard}>
                  <View style={styles.cloudTopRow}>
                    <CloudStatusDot color={item.color} />
                    <Text style={styles.cloudName}>{item.name}</Text>
                  </View>
                  <Text style={styles.cloudNodes}>{item.nodes}</Text>
                  <Text style={styles.cloudHealth}>Uptime: {item.health}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* ── Compliance Overview ── */}
        <Animated.View entering={FadeInDown.delay(320).springify()}>
          <Card glass style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Award size={18} color={colors.success} />
              <Text style={styles.sectionTitleNoMargin}>Compliance Overview</Text>
            </View>
            <View style={styles.complianceGrid}>
              {COMPLIANCE_ITEMS.map((item) => (
                <View key={item.label} style={styles.complianceItem}>
                  <CheckCircle size={14} color={item.color} />
                  <View>
                    <Text style={styles.complianceLabel}>{item.label}</Text>
                    <Text style={[styles.complianceStatus, { color: item.color }]}>{item.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* ── Risk Distribution ── */}
        {data && (
          <Animated.View entering={FadeInDown.delay(360).springify()}>
            <Card glass style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <TrendingUp size={18} color={colors.warning} />
                <Text style={styles.sectionTitleNoMargin}>Risk Exposure Distribution</Text>
              </View>
              {[
                { label: 'Critical', count: data.riskDistribution.critical, colors: ['#ef4444', '#dc2626'] as const, textColor: colors.danger },
                { label: 'High', count: data.riskDistribution.high, colors: ['#f97316', '#c2410c'] as const, textColor: colors.warning },
                { label: 'Medium', count: data.riskDistribution.medium, colors: ['#00e5ff', '#2563eb'] as const, textColor: colors.primary },
              ].map((row) => (
                <View key={row.label} style={styles.riskBarContainer}>
                  <View style={styles.riskLabelRow}>
                    <Text style={styles.riskName}>{row.label} Severity ({row.count})</Text>
                    <Text style={[styles.riskPercent, { color: row.textColor }]}>
                      {Math.round((row.count / data.totalAlerts) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.barBg}>
                    <LinearGradient
                      colors={row.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.barFill,
                        { width: `${Math.max(6, (row.count / data.totalAlerts) * 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </Card>
          </Animated.View>
        )}

        {/* ── Executive Quick Actions ── */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Card glass style={styles.sectionCard}>
            <Text style={styles.sectionTitleNoMargin}>Executive SecOps Actions</Text>
            <View style={styles.actionsList}>
              {[
                { title: 'Ask Oracle Copilot', sub: 'AI Threat Assistant & Unified AI Engine Hub', icon: <Sparkles size={18} color={colors.primary} />, iconBg: 'rgba(0, 229, 255, 0.15)', route: '/(dashboard)/(oracle)' },
                { title: 'Open Prism Investigation', sub: 'Investigation AI + Prediction AI Workspace', icon: <Network size={18} color="#3b82f6" />, iconBg: 'rgba(59,130,246,0.15)', route: '/(dashboard)/(logs)' },
                { title: 'Run Forge Playbook', sub: 'Automated Workload Containment & Mitigation', icon: <Zap size={18} color={colors.accent} />, iconBg: 'rgba(139, 92, 246, 0.15)', route: '/(dashboard)/(more)/workflows' },
                { title: 'Watchtower IoC Lookup', sub: 'Knowledge AI — IP, Hash & CVE Threat Intelligence', icon: <Eye size={18} color="#8b5cf6" />, iconBg: 'rgba(139,92,246,0.15)', route: '/(dashboard)/(more)/watchtower' },
              ].map((action) => (
                <Pressable
                  key={action.title}
                  style={styles.actionRow}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={styles.actionLeft}>
                    <View style={[styles.actionIconBox, { backgroundColor: action.iconBg }]}>
                      {action.icon}
                    </View>
                    <View style={styles.actionTextContainer}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSub}>{action.sub}</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color={colors.slate[400]} />
                </Pressable>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* ── High Priority Detections ── */}
        <View style={styles.recentSectionHeader}>
          <Text style={styles.sectionTitle}>High Priority Detections</Text>
          <Pressable onPress={() => router.push('/(dashboard)/(alerts)')} style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={colors.primary} />
          </Pressable>
        </View>

        {isLoading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={120} />
            <Skeleton height={120} />
          </View>
        ) : (
          data?.recentAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onPress={() => router.push(`/(dashboard)/(alerts)/${alert.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 24, gap: 16 },

  atlasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  atlasTagRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  atlasTag: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', color: colors.slate[500], letterSpacing: 1.5 },
  atlasTitle: { fontFamily: fonts.monoBold, fontSize: 26, fontWeight: '900', color: colors.foreground, letterSpacing: 2 },
  atlasSub: { fontSize: 11, color: colors.slate[400], marginTop: 1 },

  scoreHeroCard: { padding: 0, overflow: 'hidden' },
  scoreHeroBg: { padding: 18, overflow: 'hidden' },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.primary,
    top: 0,
  },
  scoreTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pillBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  pillText: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', color: colors.success, letterSpacing: 0.5 },
  heroTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground },
  heroSub: { fontSize: 12, color: colors.slate[400], marginTop: 2 },
  scoreCircleWrapper: {
    width: 72, height: 72, borderRadius: 36, padding: 3,
    backgroundColor: '#0c1633', alignItems: 'center', justifyContent: 'center',
  },
  scoreCircleGradient: { width: 66, height: 66, borderRadius: 33, padding: 3, alignItems: 'center', justifyContent: 'center' },
  scoreCircleInner: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#07111F',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
  },
  scoreNumber: { fontFamily: fonts.monoBold, fontSize: 22, fontWeight: '900', color: colors.foreground },
  scoreTotal: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400], marginTop: 6 },
  scoreFooterGrid: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  scoreFooterItem: { flex: 1, alignItems: 'center' },
  scoreFooterValue: { fontFamily: fonts.monoBold, fontSize: 14, fontWeight: '700', color: colors.primary },
  scoreFooterLabel: { fontSize: 10, color: colors.slate[400], marginTop: 2 },
  scoreDivider: { width: 1, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.1)' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  metricCard: { width: '100%', padding: 14 },
  metricHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  metricLabel: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', color: colors.slate[400], letterSpacing: 0.5 },
  metricValue: { fontFamily: fonts.monoBold, fontSize: 24, fontWeight: '800', color: colors.foreground },
  metricMeta: { fontSize: 10, color: colors.slate[500], marginTop: 4 },

  sectionCard: { padding: 16 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  sectionTitleNoMargin: { fontSize: 15, fontWeight: '700', color: colors.foreground, flex: 1 },

  // AI Engine Status
  allOnlinePill: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  allOnlineText: { fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', color: colors.success },
  engineGrid: { gap: 10 },
  engineItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  engineDot: { width: 7, height: 7, borderRadius: 3.5 },
  engineLabel: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  engineModule: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[500] },
  engineStatus: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '700' },

  // Oracle Insights
  insightsList: { gap: 10 },
  insightRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  insightDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  insightText: { fontSize: 12, color: colors.slate[300], lineHeight: 18, flex: 1 },

  // Cloud
  cloudGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  cloudCard: {
    width: '48%', backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12,
  },
  cloudTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  cloudDot: { width: 8, height: 8, borderRadius: 4 },
  cloudName: { fontSize: 12, fontWeight: '700', color: colors.foreground },
  cloudNodes: { fontFamily: fonts.mono, fontSize: 13, fontWeight: '700', color: colors.primary },
  cloudHealth: { fontSize: 10, color: colors.slate[400], marginTop: 2 },

  // Compliance
  complianceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  complianceItem: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(16,185,129,0.06)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, width: '47%',
  },
  complianceLabel: { fontSize: 11, fontWeight: '700', color: colors.foreground },
  complianceStatus: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '700' },

  // Risk bars
  riskBarContainer: { marginBottom: 12 },
  riskLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  riskName: { fontSize: 12, color: colors.slate[300] },
  riskPercent: { fontFamily: fonts.mono, fontSize: 12, fontWeight: '700' },
  barBg: { height: 8, backgroundColor: colors.slate[800], borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  // Actions
  actionsList: { gap: 8, marginTop: 12 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(0, 229, 255, 0.18)',
    borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12,
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  actionIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionTextContainer: { flex: 1 },
  actionTitle: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  actionSub: { fontSize: 10, color: colors.slate[400], marginTop: 1 },

  recentSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
});

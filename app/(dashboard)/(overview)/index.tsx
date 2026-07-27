import React from 'react';
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
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cloud,
  Cpu,
  Sparkles,
  TrendingUp,
  Server,
  Activity,
  Lock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDashboard } from '../../../src/hooks/useDashboard';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { AlertCard } from '../../../src/components/alerts/AlertCard';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const CLOUD_PROVIDERS = [
  { name: 'AWS Cloud', nodes: '421 Nodes', health: '99.8%', color: '#f59e0b' },
  { name: 'Azure Core', nodes: '184 Assets', health: '100%', color: '#3b82f6' },
  { name: 'Google Cloud', nodes: '96 Clusters', health: '98.5%', color: '#ea4335' },
  { name: 'Kubernetes', nodes: '64 Clusters', health: '100%', color: '#00e5ff' },
];

export default function OverviewScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  const securityScore = 92;

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
        <ScreenHeader
          title="ATLAS EXECUTIVE"
          subtitle="Real-Time Multi-Cloud Security Posture & Telemetry"
          action={
            <Badge variant="glow">
              <Activity size={10} color={colors.primary} /> NODE ONLINE
            </Badge>
          }
        />

        {/* Hero Security Posture Widget */}
        <Card glass glow glowColor="rgba(0, 229, 255, 0.4)" style={styles.scoreHeroCard}>
          <LinearGradient
            colors={['rgba(0, 229, 255, 0.12)', 'rgba(37, 99, 235, 0.05)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scoreHeroBg}
          >
            <View style={styles.scoreTopRow}>
              <View>
                <View style={styles.pillBadge}>
                  <ShieldCheck size={14} color={colors.success} />
                  <Text style={styles.pillText}>POSTURE OPTIMAL</Text>
                </View>
                <Text style={styles.heroTitle}>Global Security Score</Text>
                <Text style={styles.heroSub}>Aegis AI Threat & Compliance Index</Text>
              </View>

              {/* Large Score Dial Badge */}
              <View style={styles.scoreCircleWrapper}>
                <LinearGradient
                  colors={['#00e5ff', '#2563eb']}
                  style={styles.scoreCircleGradient}
                >
                  <View style={styles.scoreCircleInner}>
                    <Text style={styles.scoreNumber}>{securityScore}</Text>
                    <Text style={styles.scoreTotal}>/100</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Score Metrics Footer */}
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
                <Text style={[styles.scoreFooterValue, { color: colors.primary }]}>&lt; 42ms</Text>
                <Text style={styles.scoreFooterLabel}>Mean Detect Latency</Text>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* KPI Metrics Grid */}
        {isLoading || !data ? (
          <View style={styles.metricsGrid}>
            <Skeleton height={90} width="48%" />
            <Skeleton height={90} width="48%" />
            <Skeleton height={90} width="48%" />
            <Skeleton height={90} width="48%" />
          </View>
        ) : (
          <View style={styles.metricsGrid}>
            <Card glass glow glowColor="rgba(0, 229, 255, 0.3)" style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>TOTAL ALERTS</Text>
                <ShieldAlert size={16} color={colors.primary} />
              </View>
              <Text style={styles.metricValue}>{data.totalAlerts.toLocaleString()}</Text>
              <Text style={styles.metricMeta}>All Ingested Logs</Text>
            </Card>

            <Card glass glow glowColor="rgba(239, 68, 68, 0.5)" style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>CRITICAL</Text>
                <AlertTriangle size={16} color={colors.danger} />
              </View>
              <Text style={[styles.metricValue, { color: colors.danger }]}>
                {data.criticalAlerts}
              </Text>
              <Text style={styles.metricMeta}>Requires Action</Text>
            </Card>

            <Card glass glow glowColor="rgba(245, 158, 11, 0.4)" style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>ACTIVE CASES</Text>
                <Clock size={16} color={colors.warning} />
              </View>
              <Text style={[styles.metricValue, { color: colors.warning }]}>
                {data.openAlerts}
              </Text>
              <Text style={styles.metricMeta}>Under Investigation</Text>
            </Card>

            <Card glass glow glowColor="rgba(16, 185, 129, 0.4)" style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>RESOLVED</Text>
                <CheckCircle size={16} color={colors.success} />
              </View>
              <Text style={[styles.metricValue, { color: colors.success }]}>
                {data.resolvedAlerts.toLocaleString()}
              </Text>
              <Text style={styles.metricMeta}>SOAR Auto-Mitigated</Text>
            </Card>
          </View>
        )}

        {/* Multi-Cloud Infrastructure Coverage */}
        <Card glass style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Server size={18} color={colors.primary} />
            <Text style={styles.sectionTitleNoMargin}>Protected Cloud Ecosystem</Text>
          </View>
          <View style={styles.cloudGrid}>
            {CLOUD_PROVIDERS.map((item) => (
              <View key={item.name} style={styles.cloudCard}>
                <View style={styles.cloudTopRow}>
                  <View style={[styles.cloudDot, { backgroundColor: item.color }]} />
                  <Text style={styles.cloudName}>{item.name}</Text>
                </View>
                <Text style={styles.cloudNodes}>{item.nodes}</Text>
                <Text style={styles.cloudHealth}>Uptime: {item.health}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Risk Distribution Breakdown */}
        {data && (
          <Card glass style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <TrendingUp size={18} color={colors.warning} />
              <Text style={styles.sectionTitleNoMargin}>Risk Exposure Distribution</Text>
            </View>
            
            {/* Progress Bars */}
            <View style={styles.riskBarContainer}>
              <View style={styles.riskLabelRow}>
                <Text style={styles.riskName}>Critical Severity ({data.riskDistribution.critical})</Text>
                <Text style={[styles.riskPercent, { color: colors.danger }]}>
                  {Math.round((data.riskDistribution.critical / data.totalAlerts) * 100)}%
                </Text>
              </View>
              <View style={styles.barBg}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.barFill,
                    { width: `${Math.max(6, (data.riskDistribution.critical / data.totalAlerts) * 100)}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.riskBarContainer}>
              <View style={styles.riskLabelRow}>
                <Text style={styles.riskName}>High Severity ({data.riskDistribution.high})</Text>
                <Text style={[styles.riskPercent, { color: colors.warning }]}>
                  {Math.round((data.riskDistribution.high / data.totalAlerts) * 100)}%
                </Text>
              </View>
              <View style={styles.barBg}>
                <LinearGradient
                  colors={['#f97316', '#c2410c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.barFill,
                    { width: `${Math.max(6, (data.riskDistribution.high / data.totalAlerts) * 100)}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.riskBarContainer}>
              <View style={styles.riskLabelRow}>
                <Text style={styles.riskName}>Medium Severity ({data.riskDistribution.medium})</Text>
                <Text style={[styles.riskPercent, { color: colors.primary }]}>
                  {Math.round((data.riskDistribution.medium / data.totalAlerts) * 100)}%
                </Text>
              </View>
              <View style={styles.barBg}>
                <LinearGradient
                  colors={['#00e5ff', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.barFill,
                    { width: `${Math.max(6, (data.riskDistribution.medium / data.totalAlerts) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          </Card>
        )}

        {/* Executive Quick Actions */}
        <Card glass style={styles.sectionCard}>
          <Text style={styles.sectionTitleNoMargin}>Executive SecOps Actions</Text>
          <View style={styles.actionsList}>
            <Pressable
              style={styles.actionRow}
              onPress={() => router.push('/(dashboard)/(oracle)')}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(0, 229, 255, 0.15)' }]}>
                  <Sparkles size={18} color={colors.primary} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Ask Oracle Copilot</Text>
                  <Text style={styles.actionSub}>AI Threat Assistant & Telemetry Engine</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.slate[400]} />
            </Pressable>

            <Pressable
              style={styles.actionRow}
              onPress={() => router.push('/(dashboard)/(more)/workflows')}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Zap size={18} color={colors.accent} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Run SOAR Playbook</Text>
                  <Text style={styles.actionSub}>Automated Workload Containment & Mitigation</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.slate[400]} />
            </Pressable>

            <Pressable
              style={styles.actionRow}
              onPress={() => router.push('/(dashboard)/(more)/watchtower')}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <Lock size={18} color={colors.success} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Watchtower IoC Lookup</Text>
                  <Text style={styles.actionSub}>IP, Hash & CVE Threat Intelligence</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.slate[400]} />
            </Pressable>
          </View>
        </Card>

        {/* High Priority Incidents */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  scoreHeroCard: {
    padding: 0,
    overflow: 'hidden',
  },
  scoreHeroBg: {
    padding: 18,
  },
  scoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pillText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
  },
  heroSub: {
    fontSize: 12,
    color: colors.slate[400],
    marginTop: 2,
  },
  scoreCircleWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    backgroundColor: '#0c1633',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleGradient: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreNumber: {
    fontFamily: fonts.monoBold,
    fontSize: 22,
    fontWeight: '900',
    color: colors.foreground,
  },
  scoreTotal: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.slate[400],
    marginTop: 6,
  },
  scoreFooterGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  scoreFooterItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreFooterValue: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreFooterLabel: {
    fontSize: 10,
    color: colors.slate[400],
    marginTop: 2,
  },
  scoreDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  metricCard: {
    width: '48%',
    padding: 14,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate[400],
    letterSpacing: 0.5,
  },
  metricValue: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
  },
  metricMeta: {
    fontSize: 10,
    color: colors.slate[500],
    marginTop: 4,
  },
  sectionCard: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  sectionTitleNoMargin: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  cloudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  cloudCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  cloudTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cloudDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cloudName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.foreground,
  },
  cloudNodes: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  cloudHealth: {
    fontSize: 10,
    color: colors.slate[400],
    marginTop: 2,
  },
  riskBarContainer: {
    marginBottom: 12,
  },
  riskLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  riskName: {
    fontSize: 12,
    color: colors.slate[300],
  },
  riskPercent: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
  barBg: {
    height: 8,
    backgroundColor: colors.slate[800],
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionsList: {
    gap: 8,
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(0, 229, 255, 0.18)',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  actionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
  },
  actionSub: {
    fontSize: 10,
    color: colors.slate[400],
    marginTop: 1,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});


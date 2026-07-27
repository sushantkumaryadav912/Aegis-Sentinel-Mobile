import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Server, Radio, Zap } from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { colors } from '../../../src/theme/colors';
import { PulseCollector } from '../../../src/lib/types';

const MOCK_COLLECTORS: PulseCollector[] = [
  {
    id: 'col_aws_cloudtrail',
    name: 'AWS CloudTrail Stream',
    provider: 'AWS',
    status: 'HEALTHY',
    eventsPerSec: 1420,
    lagMs: 42,
    lastHeartbeat: 'Just now',
  },
  {
    id: 'col_azure_eventhub',
    name: 'Azure Monitor EventHub',
    provider: 'AZURE',
    status: 'HEALTHY',
    eventsPerSec: 890,
    lagMs: 65,
    lastHeartbeat: '2s ago',
  },
  {
    id: 'col_gcp_audit',
    name: 'GCP Pub/Sub Audit Sink',
    provider: 'GCP',
    status: 'DEGRADED',
    eventsPerSec: 310,
    lagMs: 480,
    lastHeartbeat: '12s ago',
  },
  {
    id: 'col_kafka_cluster',
    name: 'Core Kafka Event Bus',
    provider: 'KAFKA',
    status: 'HEALTHY',
    eventsPerSec: 4850,
    lagMs: 18,
    lastHeartbeat: 'Just now',
  },
  {
    id: 'col_k8s_fluentbit',
    name: 'K8s Cluster DaemonSet',
    provider: 'KUBERNETES',
    status: 'HEALTHY',
    eventsPerSec: 2100,
    lagMs: 34,
    lastHeartbeat: '1s ago',
  },
];

export default function PulseScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [collectors] = useState<PulseCollector[]>(MOCK_COLLECTORS);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const totalEps = collectors.reduce((acc, c) => acc + c.eventsPerSec, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <ScreenHeader
          title="PULSE TELEMETRY"
          subtitle="Real-time Cloud Event Stream & Collector Health"
        />

        {/* Global Throughput Metric Banner */}
        <Card glass glow glowColor={colors.primary} style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>INGESTION THROUGHPUT</Text>
              <View style={styles.metricValueRow}>
                <Zap size={22} color={colors.primary} />
                <Text style={styles.metricValue}>{totalEps.toLocaleString()}</Text>
                <Text style={styles.metricUnit}>EPS</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>AVERAGE STREAM LAG</Text>
              <View style={styles.metricValueRow}>
                <Activity size={22} color={colors.success} />
                <Text style={styles.metricValue}>38</Text>
                <Text style={styles.metricUnit}>ms</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Cloud Collector Status Grid */}
        <Text style={styles.sectionTitle}>CONNECTED CLOUD COLLECTORS</Text>

        <View style={styles.collectorsList}>
          {collectors.map((c) => (
            <Card key={c.id} style={styles.collectorCard}>
              <View style={styles.collectorHeader}>
                <View style={styles.collectorTitleRow}>
                  <Radio size={18} color={c.status === 'HEALTHY' ? colors.success : colors.warning} />
                  <Text style={styles.collectorName}>{c.name}</Text>
                </View>
                <Badge variant={c.status === 'HEALTHY' ? 'success' : 'warning'}>
                  {c.status}
                </Badge>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>THROUGHPUT</Text>
                  <Text style={styles.statValue}>{c.eventsPerSec} EPS</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>BUFFER LAG</Text>
                  <Text style={styles.statValue}>{c.lagMs} ms</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>HEARTBEAT</Text>
                  <Text style={styles.statValue}>{c.lastHeartbeat}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Kafka Pipeline Status */}
        <Card style={styles.kafkaCard}>
          <View style={styles.kafkaHeader}>
            <Server size={20} color={colors.primary} />
            <Text style={styles.kafkaTitle}>Aegis Kafka Ingestion Pipeline</Text>
          </View>
          <Text style={styles.kafkaDesc}>
            Cluster Partition Brokers: 12 Active • Consumer Groups: 8 Synced • Zero dropped frames in 24h.
          </Text>
        </Card>
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
    paddingBottom: 40,
  },
  metricsCard: {
    padding: 16,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.slate[400],
    letterSpacing: 1,
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
  },
  metricUnit: {
    fontSize: 12,
    color: colors.slate[400],
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.slate[500],
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  collectorsList: {
    gap: 12,
    marginBottom: 20,
  },
  collectorCard: {
    padding: 16,
  },
  collectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  collectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collectorName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.slate[500],
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate[200],
  },
  kafkaCard: {
    padding: 16,
  },
  kafkaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  kafkaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  kafkaDesc: {
    fontSize: 12,
    color: colors.slate[400],
    lineHeight: 18,
  },
});

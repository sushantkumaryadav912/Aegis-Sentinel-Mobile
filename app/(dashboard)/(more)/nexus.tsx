import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Radio, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const NEXUS_INTEGRATIONS = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    category: 'CLOUD',
    desc: 'Ingests CloudTrail, GuardDuty, and VPC flow logs in real-time.',
    status: 'ACTIVE',
    latency: '120ms',
    synced: 'Synced 10s ago',
    enabled: true,
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    category: 'CLOUD',
    desc: 'Streams audit events, Pub/Sub channels, and firewall telemetry.',
    status: 'ACTIVE',
    latency: '190ms',
    synced: 'Synced 1 min ago',
    enabled: true,
  },
  {
    id: 'slack',
    name: 'Slack Bot',
    category: 'ALERTING',
    desc: 'Dispatches high-priority alert cards to custom response channels.',
    status: 'ACTIVE',
    latency: '40ms',
    synced: 'Synced 12s ago',
    enabled: true,
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty Escalation',
    category: 'ALERTING',
    desc: 'Creates service incidents and pages engineers during critical outbreaks.',
    status: 'PENDING SETUP',
    latency: '-',
    synced: 'Action Required',
    enabled: false,
  },
  {
    id: 'jira',
    name: 'Atlassian Jira',
    category: 'TICKETING',
    desc: 'Generates tracking tickets in support queues for new security incidents.',
    status: 'ACTIVE',
    latency: '340ms',
    synced: 'Synced 5 mins ago',
    enabled: true,
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'CLOUD',
    desc: 'Polls Activity Logs, Security Center warnings, and Cosmos telemetry.',
    status: 'DISABLED',
    latency: '-',
    synced: 'Not connected',
    enabled: false,
  },
  {
    id: 'splunk',
    name: 'Splunk HEC Node',
    category: 'SIEM',
    desc: 'Forwards resolved security events and logs to Splunk indexes.',
    status: 'DISABLED',
    latency: '-',
    synced: 'Not connected',
    enabled: false,
  },
];

export default function NexusScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLOUD' | 'ALERTING' | 'TICKETING' | 'SIEM'>('ALL');
  const [items, setItems] = useState(NEXUS_INTEGRATIONS);

  const toggleIntegration = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
              status: !item.enabled ? 'ACTIVE' : 'DISABLED',
            }
          : item
      )
    );
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.category === activeTab;
  });

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
          <Radio size={28} color="#10b981" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Nexus</Text>
            <Text style={styles.subtitle}>
              Cloud and third-party SaaS integrations for alerts ingestion and threat dispatching
            </Text>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {['ALL', 'CLOUD', 'ALERTING', 'TICKETING', 'SIEM'].map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'ALL' ? 'ALL MODULES' : tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Integration Cards */}
        {filteredItems.map((item) => (
          <Card key={item.id} glass glow glowColor={item.enabled ? '#10b981' : 'transparent'} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryLabel}>{item.category}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>

              <Switch
                value={item.enabled}
                onValueChange={() => toggleIntegration(item.id)}
                trackColor={{ false: colors.slate[800], true: 'rgba(16, 185, 129, 0.4)' }}
                thumbColor={item.enabled ? '#10b981' : colors.slate[500]}
              />
            </View>

            <Text style={styles.descText}>{item.desc}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === 'ACTIVE'
                          ? colors.success
                          : item.status === 'PENDING SETUP'
                          ? colors.warning
                          : colors.slate[600],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === 'ACTIVE'
                          ? colors.success
                          : item.status === 'PENDING SETUP'
                          ? colors.warning
                          : colors.slate[500],
                    },
                  ]}
                >
                  {item.status} {item.latency !== '-' && `(${item.latency})`}
                </Text>
              </View>

              <Text style={styles.syncedText}>{item.synced}</Text>
            </View>
          </Card>
        ))}
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
  tabRow: { gap: 8, marginVertical: 4 },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  tabText: { fontSize: 10, fontFamily: fonts.mono, color: colors.slate[400], fontWeight: '700' },
  tabTextActive: { color: colors.success },
  card: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.slate[400], fontWeight: '700', letterSpacing: 0.5 },
  nameText: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginTop: 2 },
  descText: { fontSize: 12, color: colors.slate[300], lineHeight: 18, marginBottom: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '700' },
  syncedText: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[500] },
});


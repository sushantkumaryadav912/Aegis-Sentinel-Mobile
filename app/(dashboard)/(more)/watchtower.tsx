import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Eye,
  Search,
  CheckCircle2,
  Flame,
  Globe2,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchThreatIntel } from '../../../src/lib/api/more';
import { Card } from '../../../src/components/ui/Card';
import { SeverityBadge } from '../../../src/components/alerts/Badges';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { ThreatIntel } from '../../../src/lib/types';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const INTEL_SOURCES = [
  { name: 'AlienVault OTX Feed', status: 'Synchronised 1 min ago' },
  { name: 'MITRE ATT&CK Mapping', status: 'Synced v16 framework' },
  { name: 'Aegis Intelligence Hub', status: 'Proprietary Honeypots Feed' },
];

export default function WatchtowerScreen() {
  const router = useRouter();
  const [data, setData] = useState<{ globalRiskLevel: string; threatFeed: ThreatIntel[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchThreatIntel().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const filteredFeed = data?.threatFeed.filter(
    (t) =>
      t.indicator.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

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
          <Eye size={28} color="#8b5cf6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Watchtower</Text>
            <Text style={styles.subtitle}>
              Global Threat Intelligence and Indicator of Compromise (IoC) database
            </Text>
          </View>
        </View>

        {/* Global Risk Level Gauge */}
        {loading || !data ? (
          <Skeleton height={140} />
        ) : (
          <Card glass glow glowColor="rgba(239, 68, 68, 0.4)" style={styles.riskCard}>
            <View style={styles.riskTopRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={styles.riskHeaderRow}>
                  <Flame size={18} color={colors.danger} />
                  <Text style={styles.riskLabel}>GLOBAL RISK LEVEL</Text>
                </View>
                <Text style={styles.riskDescription}>
                  Active exploit indicators targeting cloud endpoints are elevated by 14% today. Most attacks originate from compromised proxy pools.
                </Text>
              </View>

              {/* Ring Risk Badge */}
              <View style={styles.ringWrapper}>
                <View style={styles.ringInner}>
                  <Text style={styles.riskBadgeText}>{data.globalRiskLevel}</Text>
                  <Text style={styles.riskIndexSub}>GLOBAL ALERT</Text>
                </View>
              </View>
            </View>

            <View style={styles.riskStatsRow}>
              <Text style={styles.riskStatText}>
                Active Scans: <Text style={styles.riskStatHighlight}>1,482</Text>
              </Text>
              <Text style={styles.riskStatText}>
                Alerts Today: <Text style={styles.riskStatHighlight}>76</Text>
              </Text>
            </View>
          </Card>
        )}

        {/* IoC Reputation Lookup Bar */}
        <Card glass style={styles.lookupCard}>
          <Text style={styles.sectionHeadingNoMargin}>IOC REPUTATION LOOKUP</Text>
          <View style={styles.inputContainer}>
            <Search size={16} color={colors.slate[400]} style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter IP address, domain name, or file hash..."
              placeholderTextColor={colors.slate[500]}
              value={search}
              onChangeText={setSearch}
            />
            <Pressable style={styles.checkBtn}>
              <Text style={styles.checkBtnText}>Check IoC</Text>
            </Pressable>
          </View>
        </Card>

        {/* Threat Intel Sources */}
        <Card glass style={styles.sectionCard}>
          <Text style={styles.sectionHeadingNoMargin}>THREAT INTEL SOURCES</Text>
          <View style={styles.sourcesList}>
            {INTEL_SOURCES.map((source) => (
              <View key={source.name} style={styles.sourceItem}>
                <CheckCircle2 size={16} color={colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sourceName}>{source.name}</Text>
                  <Text style={styles.sourceStatus}>{source.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Real-time Threat Intelligence Feed */}
        <Text style={styles.sectionHeading}>REAL-TIME THREAT INTELLIGENCE FEED</Text>

        {loading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={100} />
            <Skeleton height={100} />
          </View>
        ) : (
          filteredFeed?.map((item) => (
            <Card key={item.id} glass style={styles.feedCard}>
              <View style={styles.feedHeader}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
                <Text style={styles.indicatorMono}>{item.indicator}</Text>
                <SeverityBadge level={item.severity} />
              </View>

              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.sourceLabel}>Source: {item.source}</Text>
                <Text style={styles.timeLabel}>{item.lastSeen}</Text>
              </View>
            </Card>
          ))
        )}
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
  riskCard: { padding: 16 },
  riskTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  riskHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  riskLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[400], fontWeight: '700' },
  riskDescription: { fontSize: 12, color: colors.slate[300], lineHeight: 18 },
  ringWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  ringInner: { alignItems: 'center', justifyContent: 'center' },
  riskBadgeText: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.danger, fontWeight: '900' },
  riskIndexSub: { fontFamily: fonts.mono, fontSize: 8, color: colors.slate[400] },
  riskStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
    marginTop: 12,
  },
  riskStatText: { fontSize: 12, color: colors.slate[400] },
  riskStatHighlight: { fontFamily: fonts.monoBold, color: colors.foreground, fontWeight: '700' },
  lookupCard: { padding: 16 },
  sectionHeadingNoMargin: { fontSize: 13, fontWeight: '700', color: colors.foreground, fontFamily: fonts.mono, letterSpacing: 0.5 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
  },
  searchIcon: { marginRight: 6 },
  textInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 12,
    paddingVertical: 10,
  },
  checkBtn: {
    backgroundColor: '#00e5ff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  checkBtnText: {
    color: '#030712',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCard: { padding: 16 },
  sourcesList: { marginTop: 10, gap: 10 },
  sourceItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sourceName: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  sourceStatus: { fontSize: 11, color: colors.slate[400] },
  sectionHeading: { fontSize: 13, fontWeight: '700', color: colors.foreground, fontFamily: fonts.mono, marginTop: 6, letterSpacing: 0.5 },
  feedCard: { padding: 14 },
  feedHeader: { gap: 6, marginBottom: 8 },
  typeBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeBadgeText: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', color: '#a78bfa' },
  indicatorMono: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.primary },
  description: { fontSize: 13, color: colors.slate[300], lineHeight: 18, marginBottom: 10 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  sourceLabel: { fontSize: 11, color: colors.slate[400] },
  timeLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[500] },
});


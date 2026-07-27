import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, FolderLock, Plus, UserCheck, Clock, ShieldAlert } from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { SeverityBadge } from '../../../src/components/alerts/Badges';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const VAULT_CASES = [
  {
    id: 'CASE-2026-055',
    title: 'Unusual volume of IAM key creation calls',
    status: 'OPEN / NEW',
    severity: 'MEDIUM',
    assignee: 'Unassigned',
    timeAgo: '3 hours ago',
  },
  {
    id: 'CASE-2026-079',
    title: 'ConsoleLogin from anomalous proxy IP',
    status: 'TRIAGED',
    severity: 'HIGH',
    assignee: 'Jane Doe',
    timeAgo: '1 hour ago',
  },
  {
    id: 'CASE-2026-081',
    title: 'Data exfiltration attempt on S3 secret bucket',
    status: 'INVESTIGATING',
    severity: 'CRITICAL',
    assignee: 'Sushant Kumar',
    timeAgo: '20 mins ago',
  },
  {
    id: 'CASE-2026-068',
    title: 'Kubernetes container breakout warning',
    status: 'RESOLVED',
    severity: 'CRITICAL',
    assignee: 'Sushant Kumar',
    timeAgo: '1 day ago',
  },
  {
    id: 'CASE-2026-059',
    title: 'Database connection spike from developer instance',
    status: 'RESOLVED',
    severity: 'LOW',
    assignee: 'John Smith',
    timeAgo: '3 days ago',
  },
];

export default function VaultScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  const filteredCases = VAULT_CASES.filter((c) => {
    if (filter === 'ACTIVE') return c.status !== 'RESOLVED';
    if (filter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Pressable style={styles.newCaseBtn}>
          <Plus size={14} color="#030712" />
          <Text style={styles.newCaseBtnText}>New Case</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <FolderLock size={28} color="#f59e0b" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Vault</Text>
            <Text style={styles.subtitle}>
              Case Management, incident tracking, and audit-ready records
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
            onPress={() => setFilter('ALL')}
          >
            <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
              ALL CASES ({VAULT_CASES.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, filter === 'ACTIVE' && styles.filterChipActive]}
            onPress={() => setFilter('ACTIVE')}
          >
            <Text style={[styles.filterText, filter === 'ACTIVE' && styles.filterTextActive]}>
              ACTIVE CASES (3)
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, filter === 'RESOLVED' && styles.filterChipActive]}
            onPress={() => setFilter('RESOLVED')}
          >
            <Text style={[styles.filterText, filter === 'RESOLVED' && styles.filterTextActive]}>
              RESOLVED (2)
            </Text>
          </Pressable>
        </View>

        {/* Case Cards List */}
        {filteredCases.map((c) => (
          <Card key={c.id} glass glow glowColor={c.status === 'RESOLVED' ? colors.success : '#f59e0b'} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.caseIdRow}>
                <Text style={styles.caseId}>{c.id}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{c.status}</Text>
                </View>
              </View>
              <SeverityBadge level={c.severity as any} />
            </View>

            <Text style={styles.titleText}>{c.title}</Text>

            <View style={styles.footer}>
              <View style={styles.metaItem}>
                <UserCheck size={12} color={colors.slate[400]} />
                <Text style={styles.metaText}>{c.assignee}</Text>
              </View>

              <View style={styles.metaItem}>
                <Clock size={12} color={colors.slate[400]} />
                <Text style={styles.metaText}>{c.timeAgo}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  newCaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00e5ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newCaseBtnText: { color: '#030712', fontSize: 12, fontWeight: '800' },
  container: { padding: 16, paddingBottom: 40, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 12, color: colors.slate[400], marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 8, marginVertical: 4 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  filterText: { fontSize: 10, fontFamily: fonts.mono, color: colors.slate[400], fontWeight: '700' },
  filterTextActive: { color: colors.primary },
  card: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  caseIdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  caseId: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.slate[300] },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: { fontFamily: fonts.mono, fontSize: 9, color: colors.slate[400], fontWeight: '700' },
  titleText: { fontSize: 14, fontWeight: '700', color: colors.foreground, lineHeight: 18, marginBottom: 12 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[400] },
});


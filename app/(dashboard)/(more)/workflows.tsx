import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, GitBranch, Play, CheckCircle, Clock } from 'lucide-react-native';
import { useWorkflows } from '../../../src/hooks/useWorkflows';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { formatTimestamp } from '../../../src/lib/utils';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

export default function WorkflowsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useWorkflows();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <GitBranch size={28} color={colors.primary} />
          <View>
            <Text style={styles.title}>FORGE SOAR AUTOMATION</Text>
            <Text style={styles.subtitle}>Automated Remediation, Playbooks & Approvals Queue</Text>
          </View>
        </View>

        {/* Pending Approval Gate Banner */}
        <Card glass glow glowColor={colors.warning} style={styles.approvalCard}>
          <View style={styles.approvalHeader}>
            <Clock size={18} color={colors.warning} />
            <Text style={styles.approvalTitle}>1 PENDING ACTION APPROVAL</Text>
          </View>
          <Text style={styles.approvalDesc}>
            Playbook: [AWS IAM Emergency Revoke] requires Security Manager authorization.
          </Text>
          <View style={styles.approvalActions}>
            <Pressable style={styles.approveBtn}>
              <CheckCircle size={14} color="#000" />
              <Text style={styles.approveText}>APPROVE REMEDIATION</Text>
            </Pressable>
          </View>
        </Card>

        {isLoading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={120} />
            <Skeleton height={120} />
          </View>
        ) : (
          data?.map((wf) => (
            <Card key={wf.id} glass glow glowColor={wf.status === 'RUNNING' ? colors.primary : undefined} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.wfId}>{wf.id}</Text>
                <Badge
                  variant={wf.status === 'RUNNING' ? 'default' : wf.status === 'COMPLETED' ? 'success' : 'destructive'}
                >
                  {wf.status}
                </Badge>
              </View>

              <Text style={styles.name}>{wf.name}</Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Steps Executed</Text>
                  <Text style={styles.progressVal}>
                    {wf.completedSteps}/{wf.stepsCount}
                  </Text>
                </View>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(wf.completedSteps / wf.stepsCount) * 100}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.meta}>Alert Target: {wf.alertId}</Text>
                <Text style={styles.meta}>{formatTimestamp(wf.startTime)}</Text>
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
  title: { fontSize: 20, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 12, color: colors.slate[400] },
  card: { padding: 16 },
  approvalCard: { padding: 14, marginBottom: 4 },
  approvalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  approvalTitle: { fontSize: 12, fontWeight: '800', color: colors.warning },
  approvalDesc: { fontSize: 12, color: colors.slate[300], marginBottom: 10 },
  approvalActions: { flexDirection: 'row' },
  approveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.warning, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  approveText: { fontSize: 11, fontWeight: '800', color: '#000' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  wfId: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.slate[300] },
  name: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 12 },
  progressContainer: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 12, color: colors.slate[400] },
  progressVal: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary },
  barBg: { height: 6, backgroundColor: colors.slate[800], borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  meta: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[400] },
});

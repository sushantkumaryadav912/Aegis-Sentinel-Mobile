import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert as RNAlert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Server,
  UserCheck,
  CheckCircle,
  Play,
  Zap,
} from 'lucide-react-native';
import { useAlert, useUpdateAlertStatus } from '../../../src/hooks/useAlerts';
import { useTriggerWorkflow } from '../../../src/hooks/useWorkflows';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { SeverityBadge, StatusBadge } from '../../../src/components/alerts/Badges';
import { AlertDetailScreenSkeleton } from '../../../src/components/layout/ScreenSkeletons';
import { formatISOTimestamp, getRiskColor } from '../../../src/lib/utils';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: alert, isLoading } = useAlert(id as string);
  const updateStatusMutation = useUpdateAlertStatus();
  const triggerWorkflowMutation = useTriggerWorkflow();
  const [triggering, setTriggering] = useState(false);

  if (isLoading || !alert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AlertDetailScreenSkeleton />
      </SafeAreaView>
    );
  }

  const riskColor = getRiskColor(alert.severity);

  const handleResolve = () => {
    updateStatusMutation.mutate(
      { id: alert.id, status: 'RESOLVED' },
      {
        onSuccess: () => {
          RNAlert.alert('Status Updated', `Alert ${alert.id} marked as RESOLVED.`);
        },
      }
    );
  };

  const handleTriggerWorkflow = () => {
    setTriggering(true);
    triggerWorkflowMutation.mutate(
      { alertId: alert.id, workflowType: 'AUTO_ISOLATION' },
      {
        onSuccess: (wf) => {
          setTriggering(false);
          RNAlert.alert('SOAR Triggered', `Workflow ${wf.id} execution initialized.`);
        },
        onError: () => {
          setTriggering(false);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
          <Text style={styles.backText}>Back to Sentinel</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Header Card */}
        <Card glass glow glowColor={riskColor} style={styles.mainCard}>
          <View style={styles.badgeRow}>
            <Text style={styles.alertId}>{alert.id}</Text>
            <View style={styles.badges}>
              <SeverityBadge level={alert.severity} />
              <StatusBadge status={alert.status} />
            </View>
          </View>

          <Text style={styles.title}>{alert.title}</Text>

          <View style={styles.riskScoreBox}>
            <Text style={styles.riskScoreLabel}>RISK SCORE</Text>
            <Text style={[styles.riskScoreValue, { color: riskColor }]}>
              {alert.riskScore}/100
            </Text>
          </View>
        </Card>

        {/* Description & Telemetry Metadata */}
        <Card glass style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Telemetry Details</Text>
          <Text style={styles.description}>{alert.description}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Server size={14} color={colors.slate[400]} />
              <Text style={styles.metaLabel}>Cloud Provider:</Text>
              <Text style={styles.metaVal}>{alert.cloudProvider}</Text>
            </View>

            <View style={styles.metaRow}>
              <ShieldCheck size={14} color={colors.slate[400]} />
              <Text style={styles.metaLabel}>Resource ID:</Text>
              <Text style={styles.metaValMono}>{alert.resourceId}</Text>
            </View>

            <View style={styles.metaRow}>
              <UserCheck size={14} color={colors.slate[400]} />
              <Text style={styles.metaLabel}>Assigned Team:</Text>
              <Text style={styles.metaVal}>{alert.assignedTo || 'SecOps Automation'}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Detection Time:</Text>
              <Text style={styles.metaValMono}>{formatISOTimestamp(alert.timestamp)}</Text>
            </View>
          </View>
        </Card>

        {/* Recommended Remediation Steps */}
        {alert.remediationSteps && (
          <Card glass style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Automated Playbook Guidance</Text>
            {alert.remediationSteps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepDot}>
                  <Text style={styles.stepNum}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Response Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            variant="glow"
            size="lg"
            loading={triggering}
            onPress={handleTriggerWorkflow}
            icon={<Zap size={18} color="#030712" />}
          >
            TRIGGER CONTAINMENT PLAYBOOK
          </Button>

          {alert.status !== 'RESOLVED' && (
            <Button
              variant="outline"
              size="lg"
              onPress={handleResolve}
              icon={<CheckCircle size={18} color={colors.success} />}
              style={styles.resolveBtn}
            >
              MARK AS RESOLVED
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '600',
  },
  padding: {
    padding: 16,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  mainCard: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  alertId: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.slate[300],
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
    lineHeight: 26,
    marginBottom: 16,
  },
  riskScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  riskScoreLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.slate[400],
    fontWeight: '700',
  },
  riskScoreValue: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCard: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.slate[300],
    lineHeight: 22,
    marginBottom: 16,
  },
  metaGrid: {
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 13,
    color: colors.slate[400],
    width: 110,
  },
  metaVal: {
    fontSize: 13,
    color: colors.foreground,
    fontWeight: '600',
    flex: 1,
  },
  metaValMono: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.primary,
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNum: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.slate[300],
    lineHeight: 20,
  },
  actionSection: {
    gap: 12,
    marginTop: 8,
  },
  resolveBtn: {
    borderColor: colors.success,
  },
});

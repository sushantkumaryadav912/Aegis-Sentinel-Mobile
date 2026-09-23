import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter, ShieldAlert, Sparkles } from 'lucide-react-native';
import { useAlerts } from '../../../src/hooks/useAlerts';
import { AlertCard } from '../../../src/components/alerts/AlertCard';
import { Input } from '../../../src/components/ui/Input';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { EmptyState } from '../../../src/components/layout/EmptyState';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { AlertsScreenSkeleton } from '../../../src/components/layout/ScreenSkeletons';
import { LogClassifierModal } from '../../../src/components/alerts/LogClassifierModal';
import { SeverityLevel, AlertStatus } from '../../../src/lib/types';
import { colors } from '../../../src/theme/colors';

const SEVERITIES: (SeverityLevel | 'ALL')[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES: (AlertStatus | 'ALL')[] = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function AlertsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'ALL'>('ALL');
  const [classifierVisible, setClassifierVisible] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useAlerts({
    search,
    severity: selectedSeverity,
    status: selectedStatus,
  });

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <AlertsScreenSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScreenHeader
          title="SENTINEL CORE"
          subtitle="Real-Time Threat Detection & Incident Stream"
        />

        {/* AI Log Classifier Action Strip */}
        <Pressable
          onPress={() => setClassifierVisible(true)}
          style={styles.classifyBtn}
        >
          <Sparkles size={14} color="#030712" />
          <Text style={styles.classifyBtnText}>Test AI Log Classifier &amp; Benchmarks</Text>
        </Pressable>

        <LogClassifierModal
          visible={classifierVisible}
          onClose={() => setClassifierVisible(false)}
        />

        {/* Search Input */}
        <Input
          placeholder="Search alerts by title, ID, resource..."
          value={search}
          onChangeText={setSearch}
          icon={<Search size={18} color={colors.slate[400]} />}
        />

        {/* Filter Chip Rows */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {SEVERITIES.map((sev) => {
              const active = selectedSeverity === sev;
              return (
                <Pressable
                  key={sev}
                  onPress={() => setSelectedSeverity(sev)}
                  style={[styles.chip, active && styles.activeChip]}
                >
                  <Text style={[styles.chipText, active && styles.activeChipText]}>
                    {sev}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {STATUSES.map((st) => {
              const active = selectedStatus === st;
              return (
                <Pressable
                  key={st}
                  onPress={() => setSelectedStatus(st)}
                  style={[styles.chip, active && styles.activeStatusChip]}
                >
                  <Text style={[styles.chipText, active && styles.activeChipText]}>
                    {st.replace('_', ' ')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Alerts List */}
        {isLoading ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            <Skeleton height={130} />
            <Skeleton height={130} />
            <Skeleton height={130} />
          </View>
        ) : (
          <FlatList
            data={data?.data || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AlertCard
                alert={item}
                onPress={() => router.push(`/(dashboard)/(alerts)/${item.id}`)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon={<ShieldAlert size={36} color={colors.primary} />}
                title="No Alerts Match Filters"
                description="Try clearing your search query or selecting a different severity/status filter."
              />
            }
            contentContainerStyle={styles.listPadding}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
  filterSection: {
    marginBottom: 12,
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderColor: colors.primary,
  },
  activeStatusChip: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate[400],
  },
  activeChipText: {
    color: colors.foreground,
  },
  listPadding: {
    paddingBottom: 24,
  },
  classifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  classifyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#030712',
  },
});

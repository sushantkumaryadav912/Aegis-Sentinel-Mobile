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
import { Search, Terminal, Globe, UserCheck, Code } from 'lucide-react-native';
import { useLogs } from '../../../src/hooks/useLogs';
import { Card } from '../../../src/components/ui/Card';
import { Input } from '../../../src/components/ui/Input';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { SeverityBadge } from '../../../src/components/alerts/Badges';
import { EmptyState } from '../../../src/components/layout/EmptyState';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { SeverityLevel, SecurityLog } from '../../../src/lib/types';
import { formatTimestamp } from '../../../src/lib/utils';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const SEVERITIES: (SeverityLevel | 'ALL')[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

export default function LogsScreen() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, refetch, isRefetching } = useLogs({ search, severity });

  const renderLogItem = ({ item }: { item: SecurityLog }) => {
    const isExpanded = expandedId === item.id;
    return (
      <Card
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        style={styles.logCard}
      >
        <View style={styles.logHeader}>
          <View style={styles.eventTypeRow}>
            <Terminal size={14} color={colors.primary} />
            <Text style={styles.eventType}>{item.eventType}</Text>
          </View>
          <SeverityBadge level={item.severity} />
        </View>

        <View style={styles.logMetaRow}>
          <View style={styles.metaItem}>
            <Globe size={13} color={colors.slate[400]} />
            <Text style={styles.metaMono}>{item.sourceIp}</Text>
          </View>
          <View style={styles.metaItem}>
            <UserCheck size={13} color={colors.slate[400]} />
            <Text style={styles.metaText}>{item.user}</Text>
          </View>
          <Text style={styles.timeText}>{formatTimestamp(item.timestamp)}</Text>
        </View>

        {isExpanded && item.details && (
          <View style={styles.detailsBox}>
            <View style={styles.detailsHeader}>
              <Code size={13} color={colors.primary} />
              <Text style={styles.detailsTitle}>Telemetry Payload</Text>
            </View>
            <Text style={styles.jsonText}>{JSON.stringify(item.details, null, 2)}</Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScreenHeader
          title="PRISM INCIDENTS"
          subtitle="Incident Timelines & Forensic Security Telemetry"
        />

        <Input
          placeholder="Filter by IP, Event, User, Action..."
          value={search}
          onChangeText={setSearch}
          icon={<Search size={18} color={colors.slate[400]} />}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {SEVERITIES.map((sev) => {
            const active = severity === sev;
            return (
              <Pressable
                key={sev}
                onPress={() => setSeverity(sev)}
                style={[styles.chip, active && styles.activeChip]}
              >
                <Text style={[styles.chipText, active && styles.activeChipText]}>{sev}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <View style={{ gap: 10, marginTop: 12 }}>
            <Skeleton height={90} />
            <Skeleton height={90} />
            <Skeleton height={90} />
          </View>
        ) : (
          <FlatList
            data={data?.data || []}
            keyExtractor={(item) => item.id}
            renderItem={renderLogItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon={<Terminal size={36} color={colors.primary} />}
                title="No Log Records Found"
                description="No telemetry events matched your search query."
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
  chipRow: {
    flexDirection: 'row',
    marginBottom: 12,
    maxHeight: 36,
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
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate[400],
  },
  activeChipText: {
    color: colors.foreground,
  },
  logCard: {
    marginBottom: 10,
    padding: 12,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  eventType: {
    fontFamily: fonts.monoBold,
    fontSize: 13,
    color: colors.foreground,
    flex: 1,
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaMono: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.primary,
  },
  metaText: {
    fontSize: 12,
    color: colors.slate[400],
  },
  timeText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.slate[500],
  },
  detailsBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  detailsTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  jsonText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.slate[300],
  },
  listPadding: {
    paddingBottom: 24,
  },
});

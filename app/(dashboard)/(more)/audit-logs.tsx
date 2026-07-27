import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, UserCheck, Shield } from 'lucide-react-native';
import { fetchAuditLogs } from '../../../src/lib/api/more';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { AuditLog } from '../../../src/lib/types';
import { formatTimestamp } from '../../../src/lib/utils';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

export default function AuditLogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs().then((res) => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

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
          <FileText size={28} color="#3b82f6" />
          <View>
            <Text style={styles.title}>AUDIT TRAIL</Text>
            <Text style={styles.subtitle}>Immutable Security Officer Action History</Text>
          </View>
        </View>

        {loading ? (
          <Skeleton height={100} />
        ) : (
          logs.map((item) => (
            <Card key={item.id} glass style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.action}>{item.action}</Text>
                <Badge variant={item.status === 'SUCCESS' ? 'success' : 'destructive'}>
                  {item.status}
                </Badge>
              </View>
              <Text style={styles.target}>Target: {item.targetResource}</Text>
              <View style={styles.footer}>
                <Text style={styles.meta}>Actor: {item.actor} ({item.role})</Text>
                <Text style={styles.meta}>{formatTimestamp(item.timestamp)}</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  action: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.foreground, flex: 1, marginRight: 8 },
  target: { fontSize: 13, color: colors.primary, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  meta: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[400] },
});

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from '../ui/Skeleton';
import { colors } from '../../theme/colors';

/**
 * Skeleton for Mobile Overview / Atlas Executive Dashboard
 */
export function OverviewScreenSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Skeleton width={140} height={18} borderRadius={10} style={{ marginBottom: 8 }} />
          <Skeleton width={200} height={26} borderRadius={8} style={{ marginBottom: 6 }} />
          <Skeleton width={160} height={14} borderRadius={6} />
        </View>
        <Skeleton width={52} height={52} borderRadius={26} />
      </View>

      {/* Security Posture Card */}
      <View style={styles.postureCard}>
        <View style={styles.postureRow}>
          <Skeleton width={64} height={64} borderRadius={32} />
          <View style={{ flex: 1, marginLeft: 16, gap: 6 }}>
            <Skeleton width={120} height={14} borderRadius={4} />
            <Skeleton width={160} height={18} borderRadius={6} />
            <Skeleton width={140} height={12} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* 4 Stat Cards */}
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.statCard}>
            <Skeleton width={70} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
            <Skeleton width={50} height={24} borderRadius={6} style={{ marginBottom: 6 }} />
            <Skeleton width={60} height={10} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* AI Subsystems Strip */}
      <View style={styles.section}>
        <Skeleton width={160} height={16} borderRadius={6} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={100} height={36} borderRadius={18} />
          ))}
        </View>
      </View>

      {/* Recent Alerts List */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton width={150} height={18} borderRadius={6} />
          <Skeleton width={60} height={18} borderRadius={6} />
        </View>
        <View style={{ gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.alertCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Skeleton width={80} height={20} borderRadius={6} />
                <Skeleton width={50} height={20} borderRadius={6} />
              </View>
              <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
              <Skeleton width="60%" height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * Skeleton for Mobile Sentinel Core Alerts Screen
 */
export function AlertsScreenSkeleton() {
  return (
    <View style={styles.screenContainer}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
        <Skeleton width={180} height={24} borderRadius={8} />
        <Skeleton width={240} height={14} borderRadius={6} />
        <Skeleton width="100%" height={44} borderRadius={12} />
        
        {/* Chip Rows */}
        <View style={{ flexDirection: 'row', gap: 8, marginVertical: 4 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width={64} height={28} borderRadius={14} />
          ))}
        </View>
      </View>

      {/* List */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.alertCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Skeleton width={70} height={18} borderRadius={6} />
              <Skeleton width={50} height={18} borderRadius={6} />
            </View>
            <Skeleton width="85%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
            <Skeleton width="50%" height={12} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Skeleton for Mobile Alert Detail Screen
 */
export function AlertDetailScreenSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Skeleton width={80} height={32} borderRadius={8} style={{ marginBottom: 16 }} />
      
      <View style={styles.alertCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton width={90} height={22} borderRadius={6} />
          <Skeleton width={60} height={22} borderRadius={6} />
        </View>
        <Skeleton width="95%" height={22} borderRadius={6} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Skeleton width={100} height={40} borderRadius={8} />
          <Skeleton width={100} height={40} borderRadius={8} />
        </View>
      </View>

      <View style={[styles.alertCard, { marginTop: 16, gap: 8 }]}>
        <Skeleton width={180} height={18} borderRadius={6} />
        <Skeleton width="100%" height={50} borderRadius={8} />
        <Skeleton width="100%" height={50} borderRadius={8} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Skeleton width="100%" height={48} borderRadius={12} />
      </View>
    </ScrollView>
  );
}

/**
 * Skeleton for Mobile Security Logs Screen
 */
export function LogsScreenSkeleton() {
  return (
    <View style={styles.screenContainer}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
        <Skeleton width={160} height={24} borderRadius={8} />
        <Skeleton width={220} height={14} borderRadius={6} />
        <Skeleton width="100%" height={44} borderRadius={12} />
        
        <View style={{ flexDirection: 'row', gap: 8, marginVertical: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={70} height={28} borderRadius={14} />
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={[styles.alertCard, { paddingVertical: 10 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Skeleton width={110} height={14} borderRadius={4} />
              <Skeleton width={60} height={16} borderRadius={6} />
            </View>
            <Skeleton width="80%" height={15} borderRadius={4} style={{ marginBottom: 4 }} />
            <Skeleton width="50%" height={12} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  postureCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  postureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: {
    marginBottom: 20,
  },
  alertCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});


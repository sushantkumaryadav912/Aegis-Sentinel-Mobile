import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert, Server, Clock, ChevronRight } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { SeverityBadge, StatusBadge } from './Badges';
import { Alert } from '../../lib/types';
import { formatTimestamp, getRiskColor } from '../../lib/utils';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

interface AlertCardProps {
  alert: Alert;
  onPress: () => void;
}

export function AlertCard({ alert, onPress }: AlertCardProps) {
  const riskColor = getRiskColor(alert.severity);

  return (
    <Card
      onPress={onPress}
      glow={alert.severity === 'CRITICAL'}
      glowColor={riskColor}
      style={styles.cardMargin}
    >
      <View style={styles.headerRow}>
        <View style={styles.idContainer}>
          <ShieldAlert size={16} color={riskColor} />
          <Text style={styles.alertId}>{alert.id}</Text>
        </View>
        <View style={styles.badgeRow}>
          <SeverityBadge level={alert.severity} />
          <StatusBadge status={alert.status} />
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {alert.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {alert.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <Server size={13} color={colors.slate[400]} />
          <Text style={styles.metaText} numberOfLines={1}>
            {alert.cloudProvider} • {alert.resourceType}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Clock size={13} color={colors.slate[400]} />
          <Text style={styles.metaText}>{formatTimestamp(alert.timestamp)}</Text>
          <ChevronRight size={16} color={colors.slate[500]} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardMargin: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertId: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate[200],
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: colors.slate[400],
    marginBottom: 12,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.slate[400],
  },
});

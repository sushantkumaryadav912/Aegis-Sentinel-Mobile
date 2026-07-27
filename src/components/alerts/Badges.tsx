import React from 'react';
import { Badge } from '../ui/Badge';
import { getRiskColor, getRiskBgColor, getStatusColor } from '../../lib/utils';
import { RiskLevel, SeverityLevel, AlertStatus } from '../../lib/types';

export function RiskBadge({ level }: { level: RiskLevel | string }) {
  const color = getRiskColor(level);
  const bg = getRiskBgColor(level);
  return (
    <Badge customColor={color} customBg={bg}>
      {`RISK: ${level}`}
    </Badge>
  );
}

export function SeverityBadge({ level }: { level: SeverityLevel | string }) {
  const color = getRiskColor(level);
  const bg = getRiskBgColor(level);
  return (
    <Badge customColor={color} customBg={bg}>
      {level}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: AlertStatus | string }) {
  const color = getStatusColor(status);
  return (
    <Badge customColor={color} customBg={`${color}1F`}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

import { colors } from '../theme/colors';
import { RiskLevel, SeverityLevel, AlertStatus } from './types';

export function getRiskColor(level: RiskLevel | SeverityLevel | string): string {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      return colors.riskCritical;
    case 'HIGH':
      return colors.riskHigh;
    case 'MEDIUM':
      return colors.riskMedium;
    case 'LOW':
      return colors.riskLow;
    case 'INFO':
    default:
      return colors.riskInfo;
  }
}

export function getRiskBgColor(level: RiskLevel | SeverityLevel | string): string {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      return 'rgba(239, 68, 68, 0.15)';
    case 'HIGH':
      return 'rgba(249, 115, 22, 0.15)';
    case 'MEDIUM':
      return 'rgba(245, 158, 11, 0.15)';
    case 'LOW':
      return 'rgba(16, 185, 129, 0.15)';
    case 'INFO':
    default:
      return 'rgba(59, 130, 246, 0.15)';
  }
}

export function getStatusColor(status: AlertStatus | string): string {
  switch (status?.toUpperCase()) {
    case 'OPEN':
      return colors.danger;
    case 'IN_PROGRESS':
      return colors.warning;
    case 'RESOLVED':
      return colors.success;
    case 'DISMISSED':
      return colors.mutedForeground;
    default:
      return colors.slate[400];
  }
}

export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoString;
  }
}

export function formatISOTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toISOString().replace('T', ' ').substring(0, 19);
  } catch {
    return isoString;
  }
}

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Eye,
  GitBranch,
  Activity,
  FolderLock,
  Radio,
  SlidersHorizontal,
  FileText,
  Settings as SettingsIcon,
  Shield,
  ChevronRight,
  UserCheck,
  Info,
} from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { colors } from '../../../src/theme/colors';
import { useAuth, PERSONA_PROFILES } from '../../../src/context/AuthContext';
import { UserPersona } from '../../../src/lib/types';

const MENU_CATEGORIES = [
  {
    category: 'INTELLIGENCE & INVESTIGATION',
    items: [
      {
        id: 'watchtower',
        title: 'Watchtower',
        subtitle: 'Threat Intelligence, IoC Lookup & CVE Enrichment',
        icon: Eye,
        route: '/(dashboard)/(more)/watchtower',
        color: '#8b5cf6',
        personaBadge: 'SOC Analyst+',
      },
      {
        id: 'pulse',
        title: 'Pulse Telemetry',
        subtitle: 'Live Cloud Stream Ingestion & Collector Health',
        icon: Activity,
        route: '/(dashboard)/(more)/pulse',
        color: '#3b82f6',
        personaBadge: 'Security Eng+',
      },
    ],
  },
  {
    category: 'AUTOMATION & ASSETS',
    items: [
      {
        id: 'workflows',
        title: 'Forge Automation',
        subtitle: 'SOAR Playbooks, Pending Approvals & Remediation',
        icon: GitBranch,
        route: '/(dashboard)/(more)/workflows',
        color: '#00e5ff',
        personaBadge: 'Sec Manager+',
      },
      {
        id: 'vault',
        title: 'Vault Assets',
        subtitle: 'Evidence PCAPs, Cases & Secure Credentials',
        icon: FolderLock,
        route: '/(dashboard)/(more)/vault',
        color: '#f59e0b',
        personaBadge: 'SOC Analyst+',
      },
    ],
  },
  {
    category: 'ECOSYSTEM & GOVERNANCE',
    items: [
      {
        id: 'nexus',
        title: 'Nexus Connectors',
        subtitle: 'AWS, Azure, GCP, Slack, Teams & Jira Connectors',
        icon: Radio,
        route: '/(dashboard)/(more)/nexus',
        color: '#10b981',
        personaBadge: 'Cloud Admin+',
      },
      {
        id: 'admin',
        title: 'Command Administration',
        subtitle: 'Control Platform Users, RBAC Policies & Workspaces',
        icon: SlidersHorizontal,
        route: '/(dashboard)/(more)/admin',
        color: '#ef4444',
        personaBadge: 'Platform Owner',
      },
      {
        id: 'audit-logs',
        title: 'Audit Trail',
        subtitle: 'SecOps Activity Logs & Compliance Governance',
        icon: FileText,
        route: '/(dashboard)/(more)/audit-logs',
        color: '#6366f1',
        personaBadge: 'Auditor+',
      },
      {
        id: 'settings',
        title: 'Platform Settings',
        subtitle: 'App Preferences & Active Session Credentials',
        icon: SettingsIcon,
        route: '/(dashboard)/(more)/settings',
        color: colors.slate[300],
        personaBadge: 'All Users',
      },
      {
        id: 'about',
        title: 'About Aegis Sentinel',
        subtitle: 'Architecture, Certifications & Engine Build Specs',
        icon: Info,
        route: '/(dashboard)/(more)/about',
        color: '#00e5ff',
        personaBadge: 'All Users',
      },
    ],
  },
];

const PERSONAS: UserPersona[] = [
  'SOC_ANALYST',
  'SECURITY_MANAGER',
  'PLATFORM_OWNER',
  'SECURITY_ENGINEER',
  'CLOUD_ADMIN',
  'AUDITOR_EXECUTIVE',
];

export default function MoreIndexScreen() {
  const router = useRouter();
  const { user, switchPersona } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="OPERATIONS HUB"
          subtitle="AEGIS Sentinel Microservices & Administration"
        />

        {/* Persona Switcher Component */}
        <Card glass glow glowColor={colors.primary} style={styles.personaCard}>
          <View style={styles.personaHeader}>
            <View style={styles.personaTitleRow}>
              <UserCheck size={18} color={colors.primary} />
              <Text style={styles.personaTitle}>ACTIVE ROLE & PERSONA</Text>
            </View>
            <Badge variant="glow">
              {user?.persona || 'SOC_ANALYST'}
            </Badge>
          </View>
          <Text style={styles.personaName}>{user?.name}</Text>
          <Text style={styles.personaSub}>{user?.role} • {user?.email}</Text>

          <Text style={styles.switcherLabel}>SWITCH DEMO PERSONA:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.personasScroll}>
            {PERSONAS.map((p) => {
              const active = user?.persona === p;
              const title = PERSONA_PROFILES[p].roleName;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.personaChip, active && styles.personaChipActive]}
                  onPress={() => switchPersona(p)}
                >
                  <Text style={[styles.personaChipText, active && styles.personaChipTextActive]}>
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Card>

        {/* Modules Categories Grid */}
        {MENU_CATEGORIES.map((cat) => (
          <View key={cat.category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{cat.category}</Text>
            <View style={styles.menuGrid}>
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.id}
                    onPress={() => router.push(item.route as any)}
                    glow
                    glowColor={item.color}
                    style={styles.menuCard}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
                        <Icon size={20} color={item.color} />
                      </View>
                      <View style={styles.cardRight}>
                        <Text style={styles.badgeText}>{item.personaBadge}</Text>
                        <ChevronRight size={18} color={colors.slate[400]} />
                      </View>
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  </Card>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  personaCard: {
    padding: 16,
    marginBottom: 20,
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  personaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personaTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  personaName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  personaSub: {
    fontSize: 12,
    color: colors.slate[400],
    marginBottom: 12,
  },
  switcherLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate[500],
    letterSpacing: 1,
    marginBottom: 6,
  },
  personasScroll: {
    gap: 8,
    paddingRight: 10,
  },
  personaChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  personaChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.primary,
  },
  personaChipText: {
    fontSize: 11,
    color: colors.slate[400],
    fontWeight: '600',
  },
  personaChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.slate[500],
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 2,
  },
  menuGrid: {
    gap: 10,
  },
  menuCard: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 10,
    color: colors.slate[500],
    fontWeight: '600',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.slate[400],
  },
});

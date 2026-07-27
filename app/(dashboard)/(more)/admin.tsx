import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  SlidersHorizontal,
  Building2,
  Users,
  ShieldCheck,
  KeyRound,
  Globe2,
  Laptop,
  Smartphone,
  Plus,
  Lock,
  CheckCircle2,
  Cloud,
  Bell,
  Palette,
  AlertTriangle,
  RotateCw,
  Trash2,
  Eye,
} from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const TEAM_MEMBERS = [
  { id: 'm1', name: 'Admin User', role: 'OWNER', email: 'admin@company.com', status: 'Active', isPrimary: true },
  { id: 'm2', name: 'Sarah Connor', role: 'SOC MANAGER', email: 'sarah@company.com', status: 'Active' },
  { id: 'm3', name: 'John Connor', role: 'SECURITY ANALYST', email: 'john@company.com', status: 'Active' },
  { id: 'm4', name: 'T-800', role: 'READ ONLY', email: 'arnold@company.com', status: 'Pending' },
];

const AUTH_PROVIDERS = [
  { id: 'google', name: 'Google Workspace Single Sign-On', type: 'OAUTH', enabled: true },
  { id: 'github', name: 'GitHub Developer Account Federation', type: 'OAUTH', enabled: true },
  { id: 'azure', name: 'Microsoft Active Directory (AD)', type: 'SAML / ENTERPRISE', enabled: false },
  { id: 'okta', name: 'Okta Identity Command Platform', type: 'SAML / ENTERPRISE', enabled: false },
];

const CLOUD_INTEGRATIONS = [
  { name: 'AMAZON WEB SERVICES', region: 'us-east-1', status: 'CONNECTED' },
  { name: 'GOOGLE CLOUD PLATFORM', region: 'us-central1', status: 'CONNECTED' },
  { name: 'MICROSOFT AZURE', region: 'eastus', status: 'NOT CONNECTED' },
  { name: 'BARE-METAL KUBERNETES', region: 'on-prem', status: 'CONNECTED' },
];

const API_TOKENS = [
  { name: 'Production Live Scanner Key', created: '2026-07-01', lastUsed: '5 mins ago', expires: '2027-07-01' },
  { name: 'SIEM Agent Trailing Key', created: '2026-07-10', lastUsed: '1 hour ago', expires: '2026-10-10' },
];

export default function AdminScreen() {
  const router = useRouter();
  const [activeConsole, setActiveConsole] = useState<
    | 'WORKSPACE'
    | 'ORGANIZATION'
    | 'MEMBERS'
    | 'SECURITY'
    | 'AUTH'
    | 'CLOUD'
    | 'NOTIFICATIONS'
    | 'API_KEYS'
    | 'APPEARANCE'
    | 'DANGER'
  >('WORKSPACE');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [criticalSev, setCriticalSev] = useState(true);
  const [highSev, setHighSev] = useState(true);
  const [accentColor, setAccentColor] = useState('#00e5ff');

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
          <SlidersHorizontal size={28} color="#ef4444" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Command</Text>
            <Text style={styles.subtitle}>
              Configure your Aegis Sentinel workspace, profile, and integrations.
            </Text>
          </View>
        </View>

        {/* Horizontal Navigation Console Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.consoleTabRow}>
          {[
            { id: 'WORKSPACE', label: 'Workspace' },
            { id: 'ORGANIZATION', label: 'Organization' },
            { id: 'MEMBERS', label: 'Members' },
            { id: 'SECURITY', label: 'Security' },
            { id: 'AUTH', label: 'Auth Providers' },
            { id: 'CLOUD', label: 'Cloud Integrations' },
            { id: 'NOTIFICATIONS', label: 'Notifications' },
            { id: 'API_KEYS', label: 'API Keys' },
            { id: 'APPEARANCE', label: 'Appearance' },
            { id: 'DANGER', label: 'Danger Zone' },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              style={[styles.consoleTabBtn, activeConsole === tab.id && styles.consoleTabBtnActive, tab.id === 'DANGER' && activeConsole === 'DANGER' && styles.dangerTabBtnActive]}
              onPress={() => setActiveConsole(tab.id as any)}
            >
              <Text
                style={[
                  styles.consoleTabText,
                  activeConsole === tab.id && styles.consoleTabTextActive,
                  tab.id === 'DANGER' && styles.dangerTabText,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 1. WORKSPACE CONSOLE */}
        {activeConsole === 'WORKSPACE' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Building2 size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Workspace Configurations</Text>
                <Text style={styles.cardSub}>Configure parameters for your Aegis Sentinel command center</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>WORKSPACE NAME</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValue}>Aegis SOC</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>WORKSPACE URL</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValueMono}>acme-soc.aegissentinel.ai</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>WORKSPACE DESCRIPTION</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValue}>Enterprise security incident responder control console.</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ACTIVE REGION</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValueMono}>AWS N. Virginia (us-east-1)</Text>
              </View>
            </View>

            <Pressable style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>SAVE WORKSPACE SETTINGS</Text>
            </Pressable>
          </Card>
        )}

        {/* 2. ORGANIZATION CONSOLE */}
        {activeConsole === 'ORGANIZATION' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Globe2 size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Organization Parameters</Text>
                <Text style={styles.cardSub}>Manage corporate profile and administrative contacts</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>COMPANY / ORGANIZATION NAME</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValue}>Acme Technologies Pvt. Ltd.</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CORPORATE INDUSTRY</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValue}>Technology</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ORGANIZATION SIZE</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValueMono}>51-200 Employees</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>HEADQUARTERS ADDRESS</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValue}>Pune, Maharashtra, India</Text>
              </View>
            </View>

            <Pressable style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>SAVE ORGANIZATION PROFILE</Text>
            </Pressable>
          </Card>
        )}

        {/* 3. MEMBERS CONSOLE */}
        {activeConsole === 'MEMBERS' && (
          <Card glass style={styles.card}>
            <View style={styles.headerWithBtn}>
              <View style={styles.cardTitleRow}>
                <Users size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Team Members</Text>
                  <Text style={styles.cardSub}>Manage security team users and role assignments</Text>
                </View>
              </View>
              <Pressable style={styles.inviteBtn}>
                <Plus size={12} color="#030712" />
                <Text style={styles.inviteBtnText}>Invite</Text>
              </Pressable>
            </View>

            <View style={styles.membersList}>
              {TEAM_MEMBERS.map((m) => (
                <View key={m.id} style={styles.memberRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName}>{m.name}</Text>
                      <Badge variant={m.role === 'OWNER' ? 'glow' : 'secondary'}>{m.role}</Badge>
                    </View>
                    <Text style={styles.memberEmail}>{m.email}</Text>
                  </View>
                  <Text style={styles.memberStatus}>{m.status}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* 4. SECURITY CONSOLE */}
        {activeConsole === 'SECURITY' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <ShieldCheck size={20} color={colors.success} />
              <View>
                <Text style={styles.cardTitle}>Operational Security Settings</Text>
                <Text style={styles.cardSub}>Configure access control levels and procedures</Text>
              </View>
            </View>

            <View style={styles.mfaBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mfaTitle}>Authenticator App Verification</Text>
                <Text style={styles.mfaSub}>Generate dynamic 6-digit TOTP session codes</Text>
              </View>
              <Badge variant="success">ENABLED</Badge>
            </View>

            <View style={styles.deviceRow}>
              <Laptop size={16} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>Chrome on Linux (Current Device)</Text>
                <Text style={styles.deviceSub}>Pune, India</Text>
              </View>
              <Badge variant="glow">ACTIVE</Badge>
            </View>
          </Card>
        )}

        {/* 5. AUTH PROVIDERS */}
        {activeConsole === 'AUTH' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <KeyRound size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Authentication Providers</Text>
                <Text style={styles.cardSub}>Configure single sign-on (SSO) and federation keys</Text>
              </View>
            </View>

            {AUTH_PROVIDERS.map((p) => (
              <View key={p.id} style={styles.authRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.authName}>{p.name}</Text>
                  <Text style={styles.authType}>{p.type}</Text>
                </View>
                <Badge variant={p.enabled ? 'success' : 'secondary'}>{p.enabled ? 'ENABLED' : 'DISABLED'}</Badge>
              </View>
            ))}
          </Card>
        )}

        {/* 6. CLOUD INTEGRATIONS CONSOLE */}
        {activeConsole === 'CLOUD' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Cloud size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Cloud Integrations</Text>
                <Text style={styles.cardSub}>Connect and monitor your telemetry source accounts</Text>
              </View>
            </View>

            {CLOUD_INTEGRATIONS.map((cloud) => (
              <View key={cloud.name} style={styles.cloudBox}>
                <View style={styles.cloudHeader}>
                  <View>
                    <Text style={styles.cloudTitle}>{cloud.name}</Text>
                    <Text style={styles.cloudRegion}>Region: {cloud.region}</Text>
                  </View>
                  <Badge variant={cloud.status === 'CONNECTED' ? 'success' : 'secondary'}>
                    {cloud.status}
                  </Badge>
                </View>
                <View style={styles.cloudBtnRow}>
                  <Pressable style={styles.smallOutlineBtn}>
                    <Text style={styles.smallOutlineBtnText}>{cloud.status === 'CONNECTED' ? 'DISCONNECT' : 'CONNECT'}</Text>
                  </Pressable>
                  <Pressable style={styles.smallOutlineBtn}>
                    <Text style={styles.smallOutlineBtnText}>TEST</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* 7. NOTIFICATIONS CONSOLE */}
        {activeConsole === 'NOTIFICATIONS' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Bell size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Notification Channels</Text>
                <Text style={styles.cardSub}>Configure alert routing thresholds and dispatch endpoints</Text>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>EMAIL ALERTS</Text>
              <Switch value={emailAlerts} onValueChange={setEmailAlerts} trackColor={{ false: colors.slate[800], true: colors.primary }} />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>SLACK WEBHOOK</Text>
              <Switch value={slackAlerts} onValueChange={setSlackAlerts} trackColor={{ false: colors.slate[800], true: colors.primary }} />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>CRITICAL SEVERITY ALERTS</Text>
              <Switch value={criticalSev} onValueChange={setCriticalSev} trackColor={{ false: colors.slate[800], true: colors.danger }} />
            </View>

            <Pressable style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>SAVE NOTIFICATION RULES</Text>
            </Pressable>
          </Card>
        )}

        {/* 8. API KEYS CONSOLE */}
        {activeConsole === 'API_KEYS' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <KeyRound size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Console API Credentials</Text>
                <Text style={styles.cardSub}>Manage client-side tokens accessing Aegis Sentinel APIs</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ACTIVE WORKSPACE API TOKEN</Text>
              <View style={styles.fieldInputBox}>
                <Text style={styles.fieldValueMono}>••••••••••••••••••••••••••••••••</Text>
              </View>
            </View>

            <View style={styles.tokenBtnRow}>
              <Pressable style={[styles.actionBtn, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.actionBtnText}>ROTATE KEY</Text>
              </Pressable>
              <Pressable style={[styles.smallOutlineBtn, { flex: 1, paddingVertical: 12 }]}>
                <Text style={[styles.smallOutlineBtnText, { color: colors.danger }]}>REVOKE</Text>
              </Pressable>
            </View>

            <Text style={styles.secHeading}>ACTIVE TOKENS</Text>
            {API_TOKENS.map((token) => (
              <View key={token.name} style={styles.authRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.authName}>{token.name}</Text>
                  <Text style={styles.authType}>Used: {token.lastUsed} • Expires: {token.expires}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* 9. APPEARANCE CONSOLE */}
        {activeConsole === 'APPEARANCE' && (
          <Card glass style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Palette size={20} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Console Appearance</Text>
                <Text style={styles.cardSub}>Configure theme, layout densities, and visual accents</Text>
              </View>
            </View>

            <Text style={styles.secHeading}>1. SYSTEM THEME MODE</Text>
            <View style={styles.themeChipActive}>
              <Text style={styles.themeChipTitle}>Dark Ops</Text>
              <Text style={styles.themeChipSub}>Optimal for SOC Operations Mode</Text>
            </View>

            <Text style={styles.secHeading}>2. ACCENT COLOR</Text>
            <View style={styles.accentRow}>
              {['#00e5ff', '#3b82f6', '#8b5cf6', '#10b981'].map((c) => (
                <Pressable
                  key={c}
                  style={[styles.accentDot, { backgroundColor: c }, accentColor === c && styles.accentDotActive]}
                  onPress={() => setAccentColor(c)}
                />
              ))}
            </View>
          </Card>
        )}

        {/* 10. DANGER ZONE CONSOLE */}
        {activeConsole === 'DANGER' && (
          <Card glass glow glowColor="rgba(239, 68, 68, 0.6)" style={styles.card}>
            <View style={styles.cardTitleRow}>
              <AlertTriangle size={20} color={colors.danger} />
              <View>
                <Text style={[styles.cardTitle, { color: colors.danger }]}>Extreme Danger Zone</Text>
                <Text style={styles.cardSub}>Destructive workspace actions. These actions cannot be undone.</Text>
              </View>
            </View>

            <View style={styles.dangerItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dangerTitle}>DELETE WORKSPACE</Text>
                <Text style={styles.dangerSub}>Completely wipe workspace and delete indexed log flows.</Text>
              </View>
              <Pressable style={styles.dangerBtn}>
                <Text style={styles.dangerBtnText}>DELETE WORKSPACE</Text>
              </Pressable>
            </View>

            <View style={styles.dangerItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dangerTitle}>RESET WORKSPACE</Text>
                <Text style={styles.dangerSub}>Clear active SOC playbooks and trigger history nodes.</Text>
              </View>
              <Pressable style={styles.dangerBtn}>
                <Text style={styles.dangerBtnText}>RESET WORKSPACE</Text>
              </Pressable>
            </View>
          </Card>
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
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 12, color: colors.slate[400], marginTop: 2 },
  consoleTabRow: { gap: 8, marginVertical: 4 },
  consoleTabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  consoleTabBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  dangerTabBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  consoleTabText: { fontSize: 11, fontFamily: fonts.mono, color: colors.slate[400], fontWeight: '700' },
  consoleTabTextActive: { color: colors.primary },
  dangerTabText: { color: colors.danger },
  card: { padding: 16, gap: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.foreground },
  cardSub: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  headerWithBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00e5ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inviteBtnText: { color: '#030712', fontSize: 11, fontWeight: '800' },
  fieldGroup: { gap: 4 },
  fieldLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400], fontWeight: '700' },
  fieldInputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fieldValue: { fontSize: 13, color: colors.foreground },
  fieldValueMono: { fontFamily: fonts.mono, fontSize: 12, color: colors.primary },
  actionBtn: {
    backgroundColor: '#00e5ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  actionBtnText: { color: '#030712', fontSize: 12, fontWeight: '800', fontFamily: fonts.mono },
  membersList: { gap: 10 },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberName: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  memberEmail: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[400], marginTop: 2 },
  memberStatus: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate[500] },
  secHeading: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400], fontWeight: '700', letterSpacing: 0.5, marginTop: 6 },
  mfaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
  },
  mfaTitle: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  mfaSub: { fontSize: 11, color: colors.slate[400], marginTop: 2 },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
  },
  deviceName: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  deviceSub: { fontSize: 11, color: colors.slate[400] },
  authRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  authName: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  authType: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400], marginTop: 2 },
  cloudBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  cloudHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cloudTitle: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  cloudRegion: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[400], marginTop: 2 },
  cloudBtnRow: { flexDirection: 'row', gap: 8 },
  smallOutlineBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  smallOutlineBtnText: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', color: colors.foreground },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  switchLabel: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '700', color: colors.foreground },
  tokenBtnRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  themeChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00e5ff',
    borderRadius: 10,
    padding: 12,
  },
  themeChipTitle: { fontSize: 14, fontWeight: '800', color: colors.foreground },
  themeChipSub: { fontSize: 11, color: colors.slate[400], marginTop: 2 },
  accentRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  accentDot: { width: 28, height: 28, borderRadius: 14 },
  accentDotActive: { borderWidth: 2, borderColor: '#fff' },
  dangerItem: { gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  dangerTitle: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.danger, fontWeight: '700' },
  dangerSub: { fontSize: 11, color: colors.slate[400] },
  dangerBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: colors.danger,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  dangerBtnText: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.danger, fontWeight: '800' },
});



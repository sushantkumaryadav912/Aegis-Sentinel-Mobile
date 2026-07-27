import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert as RNAlert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Settings as SettingsIcon, Bell, ShieldCheck, LogOut, User, Lock } from 'lucide-react-native';
import { useAuth } from '../../../src/context/AuthContext';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, isBiometricSupported, isBiometricEnabled, biometricLabel, setBiometricPreference } = useAuth();
  const [pushAlerts, setPushAlerts] = useState(true);
  const [autoContain, setAutoContain] = useState(false);

  const handleLogout = async () => {
    RNAlert.alert('Sign Out', 'Are you sure you want to end your SecOps session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

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
          <SettingsIcon size={28} color={colors.slate[300]} />
          <View>
            <Text style={styles.title}>SYSTEM SETTINGS</Text>
            <Text style={styles.subtitle}>SecOps Mobile Preferences & Authentication</Text>
          </View>
        </View>

        {/* Profile Card */}
        <Card glass style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user?.name || 'SecOps Commander'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'admin@aegis-sentinel.io'}</Text>
              <Text style={styles.userRole}>{user?.role || 'Lead Security Architect'}</Text>
            </View>
          </View>
        </Card>

        {/* Biometrics Card */}
        <Card glass style={styles.card}>
          <Text style={styles.sectionTitle}>Biometric Security Controls</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Lock size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>{biometricLabel} Authentication</Text>
                <Text style={styles.switchSub}>
                  {isBiometricSupported
                    ? `Use ${biometricLabel} for subsequent logins instead of entering secret`
                    : 'Biometrics not available on this device'}
                </Text>
              </View>
            </View>
            <Switch
              disabled={!isBiometricSupported}
              value={isBiometricSupported && isBiometricEnabled}
              onValueChange={(val) => setBiometricPreference(val)}
              trackColor={{ false: colors.slate[800], true: colors.primary }}
              thumbColor={isBiometricEnabled ? '#030712' : colors.slate[400]}
            />
          </View>
        </Card>

        {/* Preferences */}
        <Card glass style={styles.card}>
          <Text style={styles.sectionTitle}>Alert & Notification Controls</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Bell size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Critical Alert Push Notifications</Text>
                <Text style={styles.switchSub}>Instant mobile push alerts for severity CRITICAL</Text>
              </View>
            </View>
            <Switch
              value={pushAlerts}
              onValueChange={setPushAlerts}
              trackColor={{ false: colors.slate[800], true: colors.primary }}
              thumbColor={pushAlerts ? '#030712' : colors.slate[400]}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <ShieldCheck size={18} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Auto-Trigger Containment</Text>
                <Text style={styles.switchSub}>Auto-isolate workloads when risk score &gt; 95</Text>
              </View>
            </View>
            <Switch
              value={autoContain}
              onValueChange={setAutoContain}
              trackColor={{ false: colors.slate[800], true: colors.accent }}
              thumbColor={autoContain ? '#030712' : colors.slate[400]}
            />
          </View>
        </Card>

        {/* Sign Out Button */}
        <Button
          variant="destructive"
          size="lg"
          onPress={handleLogout}
          icon={<LogOut size={18} color="#ffffff" />}
          style={styles.logoutBtn}
        >
          SIGN OUT SECURE SESSION
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  container: { padding: 16, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 12, color: colors.slate[400] },
  card: { padding: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0, 229, 255, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.3)' },
  userName: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  userEmail: { fontSize: 13, color: colors.slate[400] },
  userRole: { fontFamily: fonts.mono, fontSize: 11, color: colors.primary, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  switchLabelContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1, paddingRight: 10 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  switchSub: { fontSize: 12, color: colors.slate[400], marginTop: 2 },
  logoutBtn: { marginTop: 12, marginBottom: 24 },
});

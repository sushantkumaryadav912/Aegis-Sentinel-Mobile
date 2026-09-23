import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Mail, User as UserIcon, Lock, Building, Layers, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { registerOrganization, login } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceSlug, setWorkspaceSlug] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOrgNameChange = (val: string) => {
    setOrgName(val);
    if (!orgSlug || orgSlug === orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setOrgSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleWorkspaceNameChange = (val: string) => {
    setWorkspaceName(val);
    if (!workspaceSlug || workspaceSlug === workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setWorkspaceSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleRegister = async () => {
    if (!email || !firstName || !lastName || !password || !orgName || !workspaceName) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await registerOrganization({
        organizationName: orgName,
        organizationSlug: orgSlug || 'org-tenant',
        workspaceName: workspaceName,
        workspaceSlug: workspaceSlug || 'default-ws',
        email,
        password,
        firstName,
        lastName,
      });

      setSuccessMsg('Organization registered successfully! Verification email dispatched.');
      
      // Auto attempt login or redirect
      setTimeout(async () => {
        try {
          await login({ email, password });
          router.replace('/(dashboard)/(overview)');
        } catch (lErr) {
          router.replace('/(auth)/login');
        }
      }, 1200);
    } catch (e: any) {
      const msg = e?.message || e?.error || 'Registration failed. Check submitted values.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.topHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={18} color={colors.foreground} />
            <Text style={styles.backText}>Back to Sign In</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <Shield size={36} color={colors.primary} />
          <Text style={styles.brandTitle}>AEGIS SENTINEL</Text>
          <Text style={styles.brandSubtitle}>Multi-Tenant Enterprise Onboarding</Text>
        </View>

        <Card glass glow style={styles.card}>
          <Text style={styles.cardTitle}>Register Enterprise Tenant</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
          {successMsg ? <Text style={styles.successBanner}>{successMsg}</Text> : null}

          <Text style={styles.sectionHeader}>1. Administrator Information</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                icon={<UserIcon size={18} color={colors.slate[400]} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <Input
            label="Work Email"
            placeholder="email@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon={<Mail size={18} color={colors.slate[400]} />}
          />

          <Input
            label="Password Secret"
            placeholder="Choose a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={18} color={colors.slate[400]} />}
          />

          <Text style={styles.sectionHeader}>2. Organization & Workspace</Text>
          <Input
            label="Organization Name"
            placeholder="Acme Cyber Security Corp"
            value={orgName}
            onChangeText={handleOrgNameChange}
            icon={<Building size={18} color={colors.slate[400]} />}
          />

          <Input
            label="Workspace Name"
            placeholder="Production Operations"
            value={workspaceName}
            onChangeText={handleWorkspaceNameChange}
            icon={<Layers size={18} color={colors.slate[400]} />}
          />

          <Button
            variant="glow"
            size="lg"
            loading={loading}
            onPress={handleRegister}
            style={styles.submitBtn}
            icon={<ArrowRight size={18} color="#030712" />}
          >
            CREATE ORGANIZATION & SIGN IN
          </Button>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  topHeader: { marginBottom: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: colors.foreground, fontSize: 13, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 24, gap: 4 },
  brandTitle: { fontSize: 20, fontWeight: '800', color: colors.foreground, letterSpacing: 1.5 },
  brandSubtitle: { fontSize: 12, color: colors.slate[400] },
  card: { padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 16 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 8, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: colors.danger,
    borderWidth: 1,
    color: colors.danger,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  successBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.success,
    borderWidth: 1,
    color: colors.success,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  submitBtn: { marginTop: 16 },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, Mail, ArrowRight, ScanFace, Fingerprint } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithBiometrics, hasLoggedInOnce, isBiometricSupported, isBiometricEnabled, biometricLabel } = useAuth();
  const [email, setEmail] = useState('admin@aegis-sentinel.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [error, setError] = useState('');

  const canUseBiometrics = hasLoggedInOnce && isBiometricSupported && isBiometricEnabled;

  const triggerBiometrics = async () => {
    if (!canUseBiometrics || bioLoading) return;
    setBioLoading(true);
    setError('');
    try {
      const success = await loginWithBiometrics();
      if (success) {
        router.replace('/(dashboard)/(overview)');
      }
    } catch (e) {
      console.error('Biometric auth error:', e);
    } finally {
      setBioLoading(false);
    }
  };

  useEffect(() => {
    // Auto-prompt biometrics for subsequent logins
    if (canUseBiometrics) {
      triggerBiometrics();
    }
  }, [canUseBiometrics]);

  const handleLogin = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      router.replace('/(dashboard)/(overview)');
    } catch (e: any) {
      setError('Authentication failed. Check your credentials.');
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
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Shield size={36} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>AEGIS SENTINEL</Text>
          <Text style={styles.brandSubtitle}>Cyber Threat Detection & SOAR Platform</Text>
        </View>

        <Card glass glow glowColor={colors.primary} style={styles.card}>
          <Text style={styles.cardTitle}>SecOps Authentication</Text>
          <Text style={styles.cardDesc}>
            {canUseBiometrics
              ? `Biometrics enabled. Sign in with ${biometricLabel} or enter secret`
              : 'Sign in with your enterprise credentials'}
          </Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {canUseBiometrics && (
            <Button
              variant="outline"
              size="lg"
              loading={bioLoading}
              onPress={triggerBiometrics}
              style={styles.bioBtn}
              icon={biometricLabel.includes('Face') ? <ScanFace size={20} color={colors.primary} /> : <Fingerprint size={20} color={colors.primary} />}
            >
              {`UNLOCK WITH ${biometricLabel.toUpperCase()}`}
            </Button>
          )}

          <Input
            label="Security Identifier / Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon={<Mail size={18} color={colors.slate[400]} />}
          />

          <Input
            label="Access Secret / Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={18} color={colors.slate[400]} />}
          />

          <Button
            variant="glow"
            size="lg"
            loading={loading}
            onPress={handleLogin}
            style={styles.submitBtn}
            icon={<ArrowRight size={18} color="#030712" />}
          >
            INITIALIZE SESSION
          </Button>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Connected to Aegis Multi-Cloud Node v4.2 • Encrypted TLS 1.3
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.slate[400],
    marginTop: 4,
  },
  card: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.slate[400],
    marginBottom: 20,
  },
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
  submitBtn: {
    marginTop: 8,
  },
  bioBtn: {
    marginBottom: 16,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.slate[600],
    textAlign: 'center',
  },
});

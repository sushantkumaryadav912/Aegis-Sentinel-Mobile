import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, Mail, ArrowRight, ScanFace, Fingerprint, KeyRound, RefreshCw } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

export default function LoginScreen() {
  const router = useRouter();
  const {
    login,
    loginWithBiometrics,
    hasLoggedInOnce,
    isBiometricSupported,
    isBiometricEnabled,
    biometricLabel,
    isMfaRequired,
    verifyMfa,
    verifyRecoveryCode,
    clearMfaChallenge,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [error, setError] = useState('');

  // MFA Challenge State
  const [mfaMode, setMfaMode] = useState<'TOTP' | 'RECOVERY'>('TOTP');
  const [totpCode, setTotpCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  const canUseBiometrics = hasLoggedInOnce && isBiometricSupported && isBiometricEnabled && !isMfaRequired;

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
      const res = await login({ email, password });
      if (res.status === 'MFA_REQUIRED') {
        // MFA Challenge state is set in AuthContext
        return;
      }
      if (res.status === 'SUCCESS' || res.accessToken) {
        router.replace('/(dashboard)/(overview)');
      }
    } catch (e: any) {
      const msg = e?.message || e?.error || 'Authentication failed. Check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async () => {
    setError('');
    setMfaLoading(true);
    try {
      let success = false;
      if (mfaMode === 'TOTP') {
        if (!totpCode || totpCode.length < 6) {
          setError('Please enter valid 6-digit TOTP code');
          setMfaLoading(false);
          return;
        }
        success = await verifyMfa(totpCode);
      } else {
        if (!recoveryCode) {
          setError('Please enter your recovery code');
          setMfaLoading(false);
          return;
        }
        success = await verifyRecoveryCode(recoveryCode);
      }

      if (success) {
        router.replace('/(dashboard)/(overview)');
      } else {
        setError('Verification failed. Invalid code.');
      }
    } catch (e: any) {
      setError(e?.message || 'MFA verification failed');
    } finally {
      setMfaLoading(false);
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
          <Text style={styles.brandSubtitle}>Enterprise Security Operations & SOAR Platform</Text>
        </View>

        {isMfaRequired ? (
          <Card glass glow glowColor={colors.accent} style={styles.card}>
            <View style={styles.mfaHeader}>
              <KeyRound size={24} color={colors.accent} />
              <Text style={styles.cardTitle}>Identity Assurance (MFA)</Text>
            </View>
            <Text style={styles.cardDesc}>
              Two-Factor Authentication is enabled for this account.
            </Text>

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            {/* Mode Switcher */}
            <View style={styles.tabContainer}>
              <Pressable
                style={[styles.tab, mfaMode === 'TOTP' && styles.tabActive]}
                onPress={() => { setMfaMode('TOTP'); setError(''); }}
              >
                <Text style={[styles.tabText, mfaMode === 'TOTP' && styles.tabTextActive]}>
                  6-Digit TOTP Code
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, mfaMode === 'RECOVERY' && styles.tabActive]}
                onPress={() => { setMfaMode('RECOVERY'); setError(''); }}
              >
                <Text style={[styles.tabText, mfaMode === 'RECOVERY' && styles.tabTextActive]}>
                  Recovery Code
                </Text>
              </Pressable>
            </View>

            {mfaMode === 'TOTP' ? (
              <Input
                label="Authenticator 6-Digit Code"
                placeholder="123456"
                value={totpCode}
                onChangeText={setTotpCode}
                keyboardType="number-pad"
                maxLength={6}
                icon={<KeyRound size={18} color={colors.slate[400]} />}
              />
            ) : (
              <Input
                label="Single-Use Recovery Code"
                placeholder="A8KD-92LX"
                value={recoveryCode}
                onChangeText={setRecoveryCode}
                autoCapitalize="characters"
                icon={<RefreshCw size={18} color={colors.slate[400]} />}
              />
            )}

            <Button
              variant="glow"
              size="lg"
              loading={mfaLoading}
              onPress={handleMfaSubmit}
              style={styles.submitBtn}
              icon={<ArrowRight size={18} color="#030712" />}
            >
              VERIFY & SIGN IN
            </Button>

            <Pressable onPress={() => { clearMfaChallenge(); setError(''); }} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel & return to login</Text>
            </Pressable>
          </Card>
        ) : (
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
              placeholder="user@organization.cloud"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              icon={<Mail size={18} color={colors.slate[400]} />}
            />

            <Input
              label="Access Secret / Password"
              placeholder="Enter your password"
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

            <Pressable onPress={() => router.push('/(auth)/register')} style={styles.registerLinkContainer}>
              <Text style={styles.registerLinkText}>
                New organization? <Text style={styles.registerLinkHighlight}>Register Enterprise Tenant</Text>
              </Text>
            </Pressable>
          </Card>
        )}

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
  mfaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.slate[900],
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: colors.slate[800],
    borderWidth: 1,
    borderColor: colors.slate[700],
  },
  tabText: {
    fontSize: 12,
    color: colors.slate[400],
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  submitBtn: {
    marginTop: 8,
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    color: colors.slate[400],
    textDecorationLine: 'underline',
  },
  registerLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 13,
    color: colors.slate[400],
  },
  registerLinkHighlight: {
    color: colors.primary,
    fontWeight: '700',
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

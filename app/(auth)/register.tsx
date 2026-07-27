import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Mail, User as UserIcon, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !name) return;
    setLoading(true);
    try {
      await login({ email });
      router.replace('/(dashboard)/(overview)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Shield size={36} color={colors.primary} />
          <Text style={styles.brandTitle}>AEGIS SENTINEL</Text>
        </View>

        <Card glass glow style={styles.card}>
          <Text style={styles.cardTitle}>Register Analyst Account</Text>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            icon={<UserIcon size={18} color={colors.slate[400]} />}
          />
          <Input
            label="Work Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            icon={<Mail size={18} color={colors.slate[400]} />}
          />
          <Button
            variant="glow"
            loading={loading}
            onPress={handleRegister}
            icon={<ArrowRight size={18} color="#030712" />}
          >
            CREATE & ACCESS DASHBOARD
          </Button>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 24, gap: 8 },
  brandTitle: { fontSize: 20, fontWeight: '800', color: colors.foreground },
  card: { padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 16 },
});

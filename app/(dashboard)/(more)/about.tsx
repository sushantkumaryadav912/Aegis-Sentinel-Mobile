import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, CheckCircle2, Cpu, Lock, Terminal, Globe2, Award } from 'lucide-react-native';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const CERTIFICATIONS = [
  { name: 'SOC 2 Type II', issuer: 'AICPA Certified', code: 'SOC2-2026-COMPLIANT' },
  { name: 'ISO/IEC 27001', issuer: 'Global InfoSec Standard', code: 'ISO-27001-2022' },
  { name: 'FedRAMP High', issuer: 'US Federal Authorisation', code: 'FEDRAMP-HIGH-AUTH' },
  { name: 'HIPAA Security', issuer: 'Health Data Protection', code: 'HIPAA-SAFEGUARD' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Shield size={40} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>AEGIS SENTINEL</Text>
          <Text style={styles.brandSubtitle}>AI-Powered Enterprise Cloud Security Operations Platform</Text>
          <Badge variant="glow" style={styles.versionBadge}>MOBILE EDITION v4.2.0 (BUILD 2026.07)</Badge>
        </View>

        {/* Core Architecture */}
        <Card glass style={styles.card}>
          <Text style={styles.sectionTitle}>Platform Architecture</Text>
          <Text style={styles.bodyText}>
            Aegis Sentinel Mobile is designed for SOC Teams, Cloud Architects, and Executive Security Leaders. It unifies Cloud Detection & Response (CDR), SOAR automation, AI investigation, and real-time telemetry into a high-throughput mobile experience.
          </Text>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Cpu size={16} color={colors.primary} />
              <View>
                <Text style={styles.specTitle}>Neural Core</Text>
                <Text style={styles.specValue}>Oracle Copilot v3.8</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Lock size={16} color={colors.success} />
              <View>
                <Text style={styles.specTitle}>Transport Security</Text>
                <Text style={styles.specValue}>TLS 1.3 • AES-256 GCM</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Terminal size={16} color={colors.warning} />
              <View>
                <Text style={styles.specTitle}>Detection Engine</Text>
                <Text style={styles.specValue}>Sigma & Behavioral Analytics</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Globe2 size={16} color={colors.accent} />
              <View>
                <Text style={styles.specTitle}>Cloud Connectors</Text>
                <Text style={styles.specValue}>AWS, Azure, GCP, Kubernetes</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Security Certifications */}
        <Card glass style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Award size={18} color={colors.primary} />
            <Text style={styles.sectionTitleNoMargin}>Compliance & Governance</Text>
          </View>

          <View style={styles.certList}>
            {CERTIFICATIONS.map((c) => (
              <View key={c.name} style={styles.certItem}>
                <CheckCircle2 size={16} color={colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.certName}>{c.name}</Text>
                  <Text style={styles.certSub}>{c.issuer}</Text>
                </View>
                <Text style={styles.certCode}>{c.code}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Aegis Sentinel Inc. Enterprise Security Operations. All Rights Reserved.
          </Text>
          <Text style={styles.footerSubText}>
            Protected under US & International Patent Laws • Encrypted Session
          </Text>
        </View>
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
  brandHeader: { alignItems: 'center', paddingVertical: 12 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: { fontFamily: fonts.monoBold, fontSize: 22, fontWeight: '800', color: colors.foreground, letterSpacing: 2 },
  brandSubtitle: { fontSize: 13, color: colors.slate[400], textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
  versionBadge: { marginTop: 12 },
  card: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 10 },
  sectionTitleNoMargin: { fontSize: 15, fontWeight: '700', color: colors.foreground },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  bodyText: { fontSize: 13, color: colors.slate[300], lineHeight: 20, marginBottom: 16 },
  specGrid: { gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 14 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  specTitle: { fontSize: 11, color: colors.slate[400], fontWeight: '600' },
  specValue: { fontSize: 13, fontFamily: fonts.monoBold, color: colors.foreground },
  certList: { gap: 12 },
  certItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  certName: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  certSub: { fontSize: 11, color: colors.slate[400] },
  certCode: { fontFamily: fonts.mono, fontSize: 10, color: colors.primary },
  footer: { marginTop: 16, alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, color: colors.slate[500], textAlign: 'center' },
  footerSubText: { fontFamily: fonts.mono, fontSize: 10, color: colors.slate[600], textAlign: 'center' },
});

import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe, ShieldAlert, Layers, Sparkles, Menu } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

export default function DashboardLayout() {
  return (
    <Tabs
      initialRouteName="(overview)/index"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.slate[400],
        tabBarStyle: {
          backgroundColor: '#080f25',
          borderTopColor: 'rgba(0, 229, 255, 0.25)',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 12,
          shadowColor: '#00e5ff',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 11,
          fontWeight: '600',
        },
        sceneStyle: {
          backgroundColor: colors.background,
          marginBottom: Platform.OS === 'ios' ? 84 : 64,
        },
      }}
    >
      {/* 1. Sentinel (Detection Engine) */}
      <Tabs.Screen
        name="(alerts)/index"
        options={{
          title: 'Sentinel',
          tabBarIcon: ({ color, size }) => <ShieldAlert size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(alerts)/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      {/* 2. Prism (Investigation) */}
      <Tabs.Screen
        name="(logs)/index"
        options={{
          title: 'Prism',
          tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />,
        }}
      />

      {/* 3. Atlas (Executive Dashboard - CENTER TAB, HOME SCREEN) */}
      <Tabs.Screen
        name="(overview)/index"
        options={{
          title: 'Atlas',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerTabWrapper, focused && styles.centerTabActiveWrapper]}>
              <LinearGradient
                colors={focused ? ['#00e5ff', '#2563eb'] : ['#1e293b', '#0f172a']}
                style={styles.centerTabGradient}
              >
                <Globe size={focused ? 24 : 22} color={focused ? '#030712' : colors.primary} />
              </LinearGradient>
            </View>
          ),
        }}
      />

      {/* 4. Oracle (AI Copilot) */}
      <Tabs.Screen
        name="(oracle)/index"
        options={{
          title: 'Oracle',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
        }}
      />

      {/* 5. More (Hub & Microservices) */}
      <Tabs.Screen
        name="(more)"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerTabWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 18 : 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  centerTabActiveWrapper: {
    borderColor: '#00e5ff',
    shadowOpacity: 0.7,
    shadowRadius: 12,
  },
  centerTabGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

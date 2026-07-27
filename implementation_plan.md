# Aegis Sentinel — React Native (Expo) Dashboard Adaptation

Adapt the existing **Aegis Sentinel CIDR** Next.js web dashboard design language to a **React Native + Expo** mobile app, covering the dashboard screens only (no marketing pages). The mobile app will connect to the same backend API and replicate the dark "security operations" aesthetic with native mobile patterns.

---

## User Review Required

> [!IMPORTANT]
> **Where should the new Expo project be created?** The plan assumes `~/Projects/btech_project/cidr-mobile` — please confirm or specify a different path.

> [!IMPORTANT]
> **Expo Router vs React Navigation?** Expo Router (file-based routing) is the modern default for Expo SDK 50+. This plan uses **Expo Router**. Let me know if you prefer classic React Navigation.

> [!WARNING]
> **Auth flow scope:** The web app has login, register, MFA, password reset, and email verify pages. Should all auth screens be ported in the first pass, or only Login + a protected session check?

## Open Questions

1. **Bottom tab vs drawer navigation?** The web uses a sidebar with 9 nav items + settings + logout. On mobile, a **bottom tab navigator** (4–5 tabs) with a "More" tab is more ergonomic. Do you prefer a **drawer** to show all items, or a **bottom tab** with grouping?
2. **Which dashboard pages are priority?** The web has 11 dashboard pages: Overview, Alerts, Watchtower, Logs, Workflows, Prism, Oracle (AI chat), Vault, Nexus, Audit Logs, Settings. Should we build all in the first pass, or start with a core subset (e.g., Overview, Alerts, Logs, Oracle, Settings)?
3. **Push notifications?** Should we integrate `expo-notifications` for real-time alert push notifications from the start?
4. **Same backend API base URL?** Confirm the mobile app will hit the same `/api/cidr/*` backend. Any CORS / cookie adjustments needed for mobile (the web uses `credentials: 'include'`; mobile will need token-only auth via `Authorization: Bearer`).

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] Expo project at `~/Projects/btech_project/cidr-mobile`

- Initialize with `npx -y create-expo-app@latest ./` using the **tabs** template for Expo Router
- Expo SDK 53+ (latest stable)
- TypeScript by default

**Key dependencies to install:**

| Package | Purpose |
|---|---|
| `expo-router` | File-based navigation (included in template) |
| `@tanstack/react-query` | Same data-fetching layer as web |
| `expo-secure-store` | Secure token storage (replaces localStorage) |
| `react-native-reanimated` | Native animations (pulse-glow, transitions) |
| `react-native-gesture-handler` | Swipe-to-dismiss alerts, pull-to-refresh |
| `lucide-react-native` | Same icon library as web |
| `expo-linear-gradient` | Gradient backgrounds (replaces CSS gradients) |
| `expo-blur` | Glassmorphism blur effect |
| `expo-font` | Load Inter + JetBrains Mono fonts |
| `@expo-google-fonts/inter` | Inter font family |
| `@expo-google-fonts/jetbrains-mono` | JetBrains Mono font family |

---

### 2. Design System / Theme

#### [NEW] `src/theme/colors.ts`
Port the CSS custom properties to a TypeScript theme object:

```typescript
export const colors = {
  background: '#030712',
  backgroundElevated: '#080f25',
  foreground: '#f3f4f6',
  card: '#0b1329',
  cardForeground: '#f3f4f6',
  primary: '#00e5ff',      // cyan-400
  primaryRgb: [0, 229, 255],
  accent: '#8b5cf6',       // purple
  muted: '#1f2937',
  mutedForeground: '#9ca3af',
  border: '#1e293b',
  borderHover: '#334155',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  surfaceGlass: 'rgba(8, 15, 37, 0.65)',
  borderGlass: 'rgba(0, 229, 255, 0.12)',
  // Slate palette
  slate: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
    300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
    600: '#475569', 700: '#334155', 800: '#1e293b',
    900: '#0f172a', 950: '#020617',
  },
};
```

#### [NEW] `src/theme/typography.ts`
Font family mappings (Inter for UI, JetBrains Mono for data/metrics):

```typescript
export const fonts = {
  sans: 'Inter',
  mono: 'JetBrainsMono',
  weights: { light: '300', regular: '400', medium: '500', semiBold: '600', bold: '700', extraBold: '800' },
};
```

#### [NEW] `src/theme/spacing.ts`
Consistent spacing scale matching the web's `px-4 sm:px-6 lg:px-8` pattern adapted for mobile.

#### [NEW] `src/theme/index.ts`
Combined theme export with a `useTheme()` hook or React context for dark mode support.

---

### 3. Shared UI Components

Port the web UI component library to React Native equivalents:

#### [NEW] `src/components/ui/Card.tsx`
- Replicates the web's glass card with `expo-blur` BlurView for glassmorphism
- `glass`, `glow`, `glowColor` props matching the web API
- Subtle shadow glow via `shadowColor` with the appropriate color
- `Pressable` wrapper with Reanimated scale-down animation on press

#### [NEW] `src/components/ui/Badge.tsx`
- Pill-shaped badge with variant-based background/text colors
- Same color mappings as web (`default`, `secondary`, `destructive`, `outline`)

#### [NEW] `src/components/ui/Button.tsx`
- 7 variants matching web: `default`, `destructive`, `outline`, `ghost`, `link`, `glow`, `glass`
- 4 sizes: `default`, `sm`, `lg`, `icon`
- Reanimated press animation (`scale: 0.98` on press)
- `LinearGradient` background for `glow` variant

#### [NEW] `src/components/ui/Input.tsx`
- Styled `TextInput` matching the web's dark input with cyan focus border
- Animated border color on focus using Reanimated

#### [NEW] `src/components/ui/Skeleton.tsx`
- Animated shimmer loading placeholder using Reanimated

#### [NEW] `src/components/alerts/AlertCard.tsx`
- Card layout with title, description, risk badge, severity/status badges
- Cloud provider, resource type, timestamp metadata row
- Pressable → navigates to alert detail

#### [NEW] `src/components/alerts/Badges.tsx`
- `RiskBadge`, `SeverityBadge`, `StatusBadge` — same color mappings as web

#### [NEW] `src/components/layout/EmptyState.tsx`
- Centered icon + title + description for zero-data states

#### [NEW] `src/components/layout/ScreenHeader.tsx`
- Reusable page header with title (extrabold, slate-100) + subtitle (light, slate-400)
- Matches the `<h1>` + `<p>` pattern used on every web dashboard page

---

### 4. API Layer

#### [NEW] `src/lib/api/client.ts`
- Port the web's `apiClient` with these mobile adaptations:
  - Use `expo-secure-store` for access/refresh token storage (replaces cookies + localStorage)
  - Remove `credentials: 'include'` (not applicable on mobile)
  - Keep the same automatic 401 → refresh → retry flow
  - Same `buildUrl`, `toPaginatedResponse`, `unwrapData` helpers
  - API base URL from `expo-constants` or an `.env` via `expo-env`

#### [NEW] `src/lib/api/alerts.ts` / `dashboard.ts` / `logs.ts` / `workflows.ts` / `settings.ts` / `auth.ts`
- Direct ports of the web API functions — they are pure fetch wrappers with no DOM dependencies

#### [NEW] `src/lib/types.ts`
- Copy verbatim from web — all TypeScript interfaces/types are platform-agnostic

#### [NEW] `src/lib/utils.ts`
- Port `getRiskColor`, `getRiskBgColor`, `formatTimestamp`, `formatISOTimestamp`
- Replace `cn()` (Tailwind merge) with a React Native style-combiner utility

---

### 5. Data Hooks

#### [NEW] `src/hooks/useDashboard.ts` / `useAlerts.ts` / `useLogs.ts` / `useWorkflows.ts`
- Direct port from web — these are pure `@tanstack/react-query` hooks with no DOM dependencies
- Wrap the app in `<QueryClientProvider>` in the root layout

---

### 6. Auth Layer

#### [NEW] `src/lib/auth-tokens.ts`
- Replace `localStorage` + cookie reads with `expo-secure-store`
- `getAccessToken()`, `setAuthTokens()`, `clearAuthTokens()`, `getRefreshToken()`, `hasRefreshToken()`

#### [NEW] `src/context/AuthContext.tsx`
- React Context providing `{ isAuthenticated, user, login, logout, isLoading }`
- Wraps the root layout; checks `SecureStore` on mount
- Redirects unauthenticated users to the login screen

---

### 7. Navigation Structure (Expo Router)

```
app/
├── _layout.tsx              # Root layout: fonts, QueryProvider, AuthContext, theme
├── (auth)/
│   ├── _layout.tsx          # Stack navigator for auth screens
│   ├── login.tsx            # Login screen
│   └── register.tsx         # Register screen
├── (dashboard)/
│   ├── _layout.tsx          # Bottom tab navigator
│   ├── (overview)/
│   │   └── index.tsx        # Atlas — Executive Dashboard (Home tab)
│   ├── (alerts)/
│   │   ├── index.tsx        # Sentinel Core — Alert list
│   │   └── [id].tsx         # Alert detail screen
│   ├── (logs)/
│   │   └── index.tsx        # Pulse — Logs list
│   ├── (oracle)/
│   │   └── index.tsx        # Oracle — AI Chat
│   └── (more)/
│       ├── index.tsx        # "More" tab — grid of remaining sections
│       ├── watchtower.tsx   # Threat Intel
│       ├── workflows.tsx    # Forge — SOAR Automation
│       ├── prism.tsx        # Investigation
│       ├── vault.tsx        # Case Management
│       ├── nexus.tsx        # Integrations
│       ├── audit-logs.tsx   # Audit Logs
│       └── settings.tsx     # Settings
```

**Bottom Tab Bar** (5 tabs):
| Tab | Label | Icon | Maps to Web |
|---|---|---|---|
| 1 | Atlas | `LayoutDashboard` | Overview |
| 2 | Sentinel | `ShieldCheck` | Alerts |
| 3 | Pulse | `Terminal` | Logs |
| 4 | Oracle | `Sparkles` | AI Copilot |
| 5 | More | `Menu` | Remaining screens |

The tab bar itself will use the dark slate-950 background with cyan-400 active tint, matching the web sidebar aesthetic.

---

### 8. Screen Implementations

#### Overview Screen (`(overview)/index.tsx`)
- **Metrics cards**: Horizontal `ScrollView` of 4 metric cards (Total, Critical, Open, Resolved)
  - Each card uses `<Card glass glow>` with the matching `glowColor`
  - Monospace font for numbers, uppercase tracking for labels — same as web
- **Risk Distribution**: Progress bars with gradient fills (LinearGradient)
- **Recent Alerts**: `FlatList` of `<AlertCard>` components
- **Pull-to-refresh** via `RefreshControl` on the outer `ScrollView`

#### Alerts Screen (`(alerts)/index.tsx`)
- **Filter bar**: Horizontal chip row for severity + status filters
- **Search**: Sticky search input at top
- **Alert list**: `FlatList` with `<AlertCard>` items (not a table — tables don't translate well to mobile)
- **Pagination**: "Load more" button or infinite scroll (`onEndReached`)
- Alert detail (`[id].tsx`): Full-screen card with all alert fields, recommendation, affected services

#### Logs Screen (`(logs)/index.tsx`)
- Search input + `FlatList` of log entries
- Each log rendered as a compact card (event type, user, IP, action, risk badge, timestamp)
- Infinite scroll pagination

#### Oracle AI Chat (`(oracle)/index.tsx`)
- Chat bubble UI with `FlatList` (inverted) for messages
- Bot messages: left-aligned, slate-900 background, rounded-tl-none
- User messages: right-aligned, cyan-500 background, rounded-tr-none
- Typing indicator with bouncing dots (Reanimated)
- Suggestion pills as horizontal `ScrollView` at top
- Input bar fixed at bottom with send button
- Right sidebar (agent health / responsibilities) → accessible via a header info button → modal sheet

#### Watchtower Screen (`(more)/watchtower.tsx`)
- IoC search form + scan result card
- Threat feed as `FlatList` with severity badges
- Global Risk Level as a circular gauge component

#### Workflows Screen (`(more)/workflows.tsx`)
- `FlatList` of workflow cards (not table rows)
- Each card: workflow ID, alert ID link, type, status badge, executed by, timestamp

#### Prism Investigation (`(more)/prism.tsx`)
- Simplified node visualization using positioned `View`s + SVG lines (`react-native-svg`)
- Selectable nodes with glow animation on selection
- Node detail panel in a bottom sheet

#### Vault / Nexus / Audit Logs / Settings
- Port as card-based layouts matching their web counterparts
- Settings uses `Switch` components for toggles

---

### 9. Animations & Polish

Replicate the web's premium feel with native equivalents:

| Web Effect | React Native Equivalent |
|---|---|
| `glass-card` hover + translateY | Reanimated `scale: 0.97` on `Pressable` press |
| `animate-pulse-glow` | Reanimated `withRepeat(withTiming(...))` on `shadowOpacity` |
| `bg-radial-gradient-glow` | `expo-linear-gradient` radial approximation as background |
| `backdrop-blur` glassmorphism | `expo-blur` `BlurView` with `intensity={16}` |
| `scan-line-effect` | Reanimated animated `translateY` on an overlay `View` |
| Framer Motion `AnimatePresence` | `Animated.View` enter/exit with `Layout` transition |
| Tab indicator gradient underline | Custom tab bar with animated gradient indicator |

---

### 10. Project Structure Summary

```
cidr-mobile/
├── app/                     # Expo Router screens (see §7)
├── src/
│   ├── components/
│   │   ├── ui/              # Card, Badge, Button, Input, Skeleton
│   │   ├── alerts/          # AlertCard, Badges
│   │   └── layout/          # EmptyState, ScreenHeader
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/               # useDashboard, useAlerts, useLogs, useWorkflows
│   ├── lib/
│   │   ├── api/             # client, alerts, dashboard, logs, workflows, auth, settings
│   │   ├── auth-tokens.ts   # SecureStore wrapper
│   │   ├── types.ts         # Domain types (verbatim from web)
│   │   └── utils.ts         # Formatting utilities
│   └── theme/               # colors, typography, spacing, index
├── assets/                  # App icon, splash, fonts
├── app.json                 # Expo config
└── package.json
```

---

## Verification Plan

### Automated Tests
- `npx expo start` — verify the app compiles and launches in Expo Go on iOS/Android
- Run TypeScript type-check: `npx tsc --noEmit`

### Manual Verification
- Launch on iOS Simulator and Android Emulator
- Verify auth flow (login → dashboard redirect)
- Verify all dashboard screens render with mock/real data
- Verify pull-to-refresh, infinite scroll, search filters
- Verify dark theme consistency across all screens
- Verify Oracle chat UI interaction
- Test on a physical device for animation performance (60fps)

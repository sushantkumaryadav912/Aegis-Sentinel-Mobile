import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const LOGIN_COUNT_KEY = 'aegis_login_count';
const HAS_LOGGED_IN_ONCE_KEY = 'aegis_has_logged_in_once';
const BIOMETRICS_ENABLED_KEY = 'aegis_biometrics_enabled';

export interface BiometricStatus {
  isSupported: boolean;
  isEnrolled: boolean;
  biometricLabel: string;
}

export async function checkBiometricSupport(): Promise<BiometricStatus> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    let biometricLabel = 'Biometrics';
    if (hasHardware && isEnrolled) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricLabel = 'Face ID';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricLabel = 'Fingerprint / Touch ID';
      }
    }

    return {
      isSupported: hasHardware,
      isEnrolled,
      biometricLabel,
    };
  } catch (error) {
    console.error('Error checking biometric support:', error);
    return {
      isSupported: false,
      isEnrolled: false,
      biometricLabel: 'Biometrics',
    };
  }
}

export async function authenticateBiometric(promptMessage = 'Verify identity to unlock SecOps session'): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use Password',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch (error) {
    console.error('Error performing biometric authentication:', error);
    return false;
  }
}

export async function getLoginCount(): Promise<number> {
  try {
    const value = await SecureStore.getItemAsync(LOGIN_COUNT_KEY);
    if (value !== null) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    // Backward compatibility fallback for boolean key
    const oldFlag = await SecureStore.getItemAsync(HAS_LOGGED_IN_ONCE_KEY);
    return oldFlag === 'true' ? 1 : 0;
  } catch (error) {
    return 0;
  }
}

export async function incrementLoginCount(): Promise<number> {
  try {
    const current = await getLoginCount();
    const nextCount = current + 1;
    await SecureStore.setItemAsync(LOGIN_COUNT_KEY, nextCount.toString());
    await SecureStore.setItemAsync(HAS_LOGGED_IN_ONCE_KEY, 'true');
    return nextCount;
  } catch (error) {
    console.error('Error incrementing login count:', error);
    return 1;
  }
}

export async function setHasLoggedInOnce(value: boolean): Promise<void> {
  try {
    if (value) {
      const current = await getLoginCount();
      if (current === 0) {
        await SecureStore.setItemAsync(LOGIN_COUNT_KEY, '1');
      }
    } else {
      await SecureStore.setItemAsync(LOGIN_COUNT_KEY, '0');
    }
    await SecureStore.setItemAsync(HAS_LOGGED_IN_ONCE_KEY, value ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting hasLoggedInOnce:', error);
  }
}

export async function getHasLoggedInOnce(): Promise<boolean> {
  const count = await getLoginCount();
  return count >= 1;
}

export async function setBiometricsEnabledPreference(enabled: boolean): Promise<void> {
  try {
    await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving biometrics preference:', error);
  }
}

export async function getBiometricsEnabledPreference(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
    // Defaults to true if not explicitly set
    return value !== 'false';
  } catch (error) {
    return true;
  }
}

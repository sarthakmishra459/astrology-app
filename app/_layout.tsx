import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { KundliProvider } from '@/context/KundliContext';
import { AppColors } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: AppColors.background,
      card: AppColors.surfaceElevated,
      primary: AppColors.indigo,
      text: AppColors.ink,
      border: AppColors.line,
    },
  };

  return (
    <SafeAreaProvider>
      <KundliProvider>
        <ThemeProvider value={theme}>
          <Stack screenOptions={{ contentStyle: { backgroundColor: AppColors.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </KundliProvider>
    </SafeAreaProvider>
  );
}

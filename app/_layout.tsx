// app/_layout.tsx
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";

import "../assets/styles/global.css";

import { sheetScreenOptions } from "@/components/layout/bottom-sheet/constants/screenOption";
import { toastConfig } from "@/components/layout/ToastConfig";
import { SessionProvider } from "@/feature/auth/application/contexts/SessionContext";
import { AuthRedirectGuard } from "@/feature/auth/presentation/components/guard/AuthRedirectGuard";

// フォントの読み込みが完了するまでスプラッシュスクリーンを表示し続ける
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch((error) => {
        // エラーをログに記録
        console.warn("Failed to hide splash screen:", error);
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // フォントがロードされるまで何も表示しない
  }

  return (
    <SessionProvider>
      <AuthRedirectGuard>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          <GestureHandlerRootView className="flex-1">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "white",
                  },
                }}
              >
                {/* メインアプリ画面 */}
                <Stack.Screen name="(protected)" />
                <Stack.Screen name="(auth)" />

                {/* リンク入力ボトムシート */}
                <Stack.Screen
                  name="bottom-sheet"
                  options={{
                    ...sheetScreenOptions,
                  }}
                />
              </Stack>
              <Toast config={toastConfig} />
            </KeyboardAvoidingView>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthRedirectGuard>
    </SessionProvider>
  );
}

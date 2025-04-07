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

import { toastConfig } from "@/components/layout/ToastConfig";
import {
  SessionProvider,
  useSessionContext,
} from "@/feature/auth/application/contexts/SessionContext";
import { AuthRedirectGuard } from "@/feature/auth/presentation/components/guard/AuthRedirectGuard";

// フォントの読み込みが完了するまでスプラッシュスクリーンを表示し続ける
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isLoading: isSessionLoading } = useSessionContext();

  // セッションのロードが完了したらスプラッシュスクリーンを非表示にする
  useEffect(() => {
    if (!isSessionLoading) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Failed to hide splash screen:", error);
      });
    }
  }, [isSessionLoading]);

  // セッションのロード中は何も表示しない（スプラッシュスクリーンが表示されたまま）
  if (isSessionLoading) {
    return null;
  }

  return (
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
            </Stack>
            <Toast config={toastConfig} />
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthRedirectGuard>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    // フォントのロードに失敗した場合でもタイムアウトでスプラッシュスクリーンを非表示にする
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 3000); // 3秒後にタイムアウト

    return () => clearTimeout(timeout);
  }, []);

  if (!fontsLoaded) {
    return null; // フォントがロードされるまで何も表示しない
  }

  return (
    <SessionProvider>
      <RootLayoutContent />
    </SessionProvider>
  );
}

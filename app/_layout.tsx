// app/_layout.jsx
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import Toast from "react-native-toast-message";
import { Slot } from "expo-router";
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
import { AuthRedirectGuard } from "@/feature/auth/components";
import { SessionProvider } from "@/feature/auth/contexts/SessionContext";

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
      SplashScreen.hideAsync().catch(() => {
        // エラーハンドリング
      });
    }
  }, [fontsLoaded]);

  return (
    <SessionProvider>
      <AuthRedirectGuard>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <SafeAreaView className="items-left justify-top flex-1 p-4">
            <Slot />
          </SafeAreaView>
          <Toast config={toastConfig} />
        </KeyboardAvoidingView>
      </AuthRedirectGuard>
    </SessionProvider>
  );
}

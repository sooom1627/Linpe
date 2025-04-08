import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Session } from "@supabase/supabase-js";

// オンボーディングが完了したかどうかを保存するキー
const ONBOARDING_COMPLETE_KEY = "hasCompletedOnboarding";

export const useAuthRedirect = (
  session: Session | null,
  isLoading: boolean,
) => {
  const segments = useSegments();
  const router = useRouter();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // オンボーディングの完了状態を取得
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        console.log(`[DEBUG] useAuthRedirect: onboarding status = ${value}`);
        setIsOnboardingCompleted(value === "true");
      } catch (error) {
        console.error(
          "[DEBUG] useAuthRedirect: Failed to get onboarding status:",
          error,
        );
        setIsOnboardingCompleted(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    // セッションまたはオンボーディングのロード中はリダイレクトを行わない
    if (isLoading || isCheckingOnboarding || isOnboardingCompleted === null) {
      console.log("[DEBUG] useAuthRedirect: Still loading, skipping redirect");
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";
    const isInOnboarding =
      segments[0] === "(auth)" && segments[1] === "onboarding";
    const isInLogin = segments[0] === "(auth)" && segments[1] === "loginScreen";

    console.log(
      `[DEBUG] useAuthRedirect: segments=${segments}, isOnboardingCompleted=${isOnboardingCompleted}, session=${!!session}`,
    );

    if (!segments.length) {
      console.log("[DEBUG] useAuthRedirect: No segments, skipping redirect");
      return; // セグメントが空の場合は早期リターン
    }

    // setTimeout を使用して、ナビゲーションをマイクロタスクキューに入れる
    setTimeout(() => {
      // 以下の条件でリダイレクト:

      // 1. オンボーディング未完了 + ログイン状態に関わらず + 現在オンボーディング以外の画面 → オンボーディングへ
      if (!isOnboardingCompleted && !isInOnboarding) {
        console.log(
          "[DEBUG] useAuthRedirect: Redirecting to onboarding (not completed)",
        );
        router.replace("/(auth)/onboarding");
        return;
      }

      // 2. オンボーディング完了済み
      if (isOnboardingCompleted) {
        // 2.1 ログイン済み + 認証必要な画面以外にいる → メイン画面へ
        if (session && inAuthGroup && !isInOnboarding) {
          console.log(
            "[DEBUG] useAuthRedirect: Redirecting to protected area (logged in)",
          );
          router.replace("/(protected)/(tabs)");
          return;
        }

        // 2.2 未ログイン + 保護領域にいる → ログイン画面へ
        if (!session && inProtectedGroup) {
          console.log(
            "[DEBUG] useAuthRedirect: Redirecting to login (not logged in)",
          );
          router.replace("/(auth)/loginScreen");
          return;
        }
      }

      console.log("[DEBUG] useAuthRedirect: No redirect needed");
    }, 0);
  }, [
    session,
    segments,
    router,
    isLoading,
    isOnboardingCompleted,
    isCheckingOnboarding,
  ]);
};

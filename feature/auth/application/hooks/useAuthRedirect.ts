import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { type Session } from "@supabase/supabase-js";

import { useOnboardingStatus } from "@/shared/onboarding";

export const useAuthRedirect = (
  session: Session | null,
  isLoading: boolean,
) => {
  const segments = useSegments();
  const router = useRouter();
  const { isOnboardingCompleted, isLoading: isCheckingOnboarding } =
    useOnboardingStatus();

  useEffect(() => {
    // セッションまたはオンボーディングのロード中はリダイレクトを行わない
    if (isLoading || isCheckingOnboarding || isOnboardingCompleted === null) {
      return;
    }

    if (!segments.length) {
      return; // セグメントが空の場合は早期リターン
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";
    // 型定義の拡張により、安全にアクセス可能になった
    const isInOnboarding =
      inAuthGroup && segments.length > 1 && segments[1] === "onboarding";

    // リダイレクトロジックを別関数に分離
    const redirectBasedOnStatus = () => {
      // 1. オンボーディング未完了 + ログイン状態に関わらず + 現在オンボーディング以外の画面 → オンボーディングへ
      if (!isOnboardingCompleted && !isInOnboarding) {
        router.replace("/(auth)/onboarding");
        return;
      }

      // 2. オンボーディング完了済み
      if (isOnboardingCompleted) {
        // 2.1 ログイン済み + 認証必要な画面以外にいる → メイン画面へ
        if (session && inAuthGroup && !isInOnboarding) {
          router.replace("/(protected)/(tabs)");
          return;
        }

        // 2.2 未ログイン + 保護領域にいる → ログイン画面へ
        if (!session && inProtectedGroup) {
          router.replace("/(auth)/loginScreen");
          return;
        }
      }
    };

    // setTimeout を使用して、ナビゲーションをマイクロタスクキューに入れる
    setTimeout(() => {
      redirectBasedOnStatus();
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

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { type Session } from "@supabase/supabase-js";

export const useAuthRedirect = (
  session: Session | null,
  isLoading: boolean,
) => {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // セッションのロード中はリダイレクトを行わない
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (!segments.length) return; // セグメントが空の場合は早期リターン

    // setTimeout を使用して、ナビゲーションをマイクロタスクキューに入れる
    setTimeout(() => {
      if (session && inAuthGroup) {
        router.replace("/(protected)/(tabs)");
      } else if (!session && inProtectedGroup) {
        router.replace("/(auth)/loginScreen");
      }
    }, 0);
  }, [session, segments, router, isLoading]);
};

import { useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Session } from "@supabase/supabase-js";
import { renderHook } from "@testing-library/react-native";

import { ONBOARDING_COMPLETE_KEY } from "@/app/(auth)/onboarding";
import { useAuthRedirect } from "../../application/hooks/useAuthRedirect";

/**
 * リダイレクトテスト用の条件設定ヘルパー関数
 *
 * @param onboardingCompleted オンボーディング完了状態
 * @param segments 現在のセグメント配列
 * @param session セッション情報（ログイン状態）
 * @param isLoading ローディング状態
 * @returns renderHook結果
 */
export const setupTestCondition = async (
  onboardingCompleted: boolean,
  segments: string[],
  session: Session | null,
  isLoading = false,
) => {
  // オンボーディング状態を設定
  await AsyncStorage.setItem(
    ONBOARDING_COMPLETE_KEY,
    onboardingCompleted ? "true" : "false",
  );

  // セグメントモックを設定
  (useSegments as jest.Mock).mockReturnValue(segments);

  // フックをレンダリング
  return renderHook(() => useAuthRedirect(session, isLoading));
};

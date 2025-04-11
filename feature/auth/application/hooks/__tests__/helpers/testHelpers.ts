import { useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Session } from "@supabase/supabase-js";
import { renderHook } from "@testing-library/react-native";

import {
  ONBOARDING_COMPLETE_KEY,
  useOnboardingStatus,
} from "@/shared/onboarding";
import { useAuthRedirect } from "../../useAuthRedirect";

// モック
jest.mock("@/shared/onboarding", () => ({
  ONBOARDING_COMPLETE_KEY: "hasCompletedOnboarding",
  useOnboardingStatus: jest.fn(),
}));

// useOnboardingStatusのモック設定関数
const setupOnboardingMock = (completed: boolean) => {
  // ES lintに準拠した方法でモックにアクセス
  (useOnboardingStatus as jest.Mock).mockReturnValue({
    isOnboardingCompleted: completed,
    isLoading: false,
    checkIsCompleted: jest.fn(),
    setCompleted: jest.fn(),
    resetStatus: jest.fn(),
  });
};

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
  // オンボーディング状態をモック
  setupOnboardingMock(onboardingCompleted);

  // AsyncStorageは不要になったが、互換性のため残す
  await AsyncStorage.setItem(
    ONBOARDING_COMPLETE_KEY,
    onboardingCompleted ? "true" : "false",
  );

  // セグメントモックを設定
  (useSegments as jest.Mock).mockReturnValue(segments);

  // フックをレンダリング
  return renderHook(() => useAuthRedirect(session, isLoading));
};

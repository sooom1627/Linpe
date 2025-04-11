import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import supabase from "@/lib/supabase";
import { ONBOARDING_COMPLETE_KEY } from "../constants";

/**
 * オンボーディングの状態を管理するカスタムフック
 */
export const useOnboardingStatus = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  // オンボーディング状態を確認
  useEffect(() => {
    checkIsCompleted()
      .then((completed) => setIsOnboardingCompleted(completed))
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * オンボーディングが完了しているかチェック
   */
  const checkIsCompleted = async (): Promise<boolean> => {
    try {
      // セッション状態を確認
      const { data } = await supabase.auth.getSession();

      // ログアウト状態の場合は常にfalseを返す（開発用）
      if (!data.session) {
        return false;
      }

      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      return value === "true";
    } catch (error) {
      console.error("[DEBUG] Failed to get onboarding status:", error);
      return false;
    }
  };

  /**
   * オンボーディングを完了としてマーク
   */
  const setCompleted = async (): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
      setIsOnboardingCompleted(true);
      return true;
    } catch (error) {
      console.error("[DEBUG] Failed to save onboarding status:", error);
      return false;
    }
  };

  /**
   * オンボーディング状態をリセット
   */
  const resetStatus = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      setIsOnboardingCompleted(false);
      return true;
    } catch (error) {
      console.error("[DEBUG] Failed to remove onboarding status:", error);
      return false;
    }
  };

  return {
    isOnboardingCompleted,
    isLoading,
    checkIsCompleted,
    setCompleted,
    resetStatus,
  };
};

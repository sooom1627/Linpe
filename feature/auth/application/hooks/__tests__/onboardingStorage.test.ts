import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";

import { ONBOARDING_COMPLETE_KEY } from "../../../../../app/(auth)/onboarding";

// 簡易的なonboardingStatusフックを作成（テスト用）
const useOnboardingStatus = () => {
  const checkIsCompleted = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      return value === "true";
    } catch (error) {
      console.error("Failed to get onboarding status:", error);
      return false;
    }
  };

  const setCompleted = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
      return true;
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
      return false;
    }
  };

  const resetStatus = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      return true;
    } catch (error) {
      console.error("Failed to remove onboarding status:", error);
      return false;
    }
  };

  return {
    checkIsCompleted,
    setCompleted,
    resetStatus,
  };
};

describe("オンボーディングStorage機能", () => {
  // 各テストの前にAsyncStorageをクリア
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test("初期状態ではオンボーディング未完了状態である", async () => {
    const { result } = renderHook(() => useOnboardingStatus());

    let isCompleted;
    await act(async () => {
      isCompleted = await result.current.checkIsCompleted();
    });

    expect(isCompleted).toBe(false);
  });

  test("オンボーディング完了状態を保存できる", async () => {
    const { result } = renderHook(() => useOnboardingStatus());

    // 完了状態を保存
    await act(async () => {
      await result.current.setCompleted();
    });

    // 状態を確認
    let isCompleted;
    await act(async () => {
      isCompleted = await result.current.checkIsCompleted();
    });

    expect(isCompleted).toBe(true);
  });

  test("AsyncStorageに直接値を設定した場合も正しく状態を取得できる", async () => {
    // AsyncStorageに直接設定
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");

    const { result } = renderHook(() => useOnboardingStatus());

    // 状態を確認
    let isCompleted;
    await act(async () => {
      isCompleted = await result.current.checkIsCompleted();
    });

    expect(isCompleted).toBe(true);
  });

  test("状態をリセットできる", async () => {
    // 最初に完了状態にする
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");

    const { result } = renderHook(() => useOnboardingStatus());

    // リセット
    await act(async () => {
      await result.current.resetStatus();
    });

    // 状態を確認
    let isCompleted;
    await act(async () => {
      isCompleted = await result.current.checkIsCompleted();
    });

    expect(isCompleted).toBe(false);
  });

  test("不正な値が保存された場合は未完了として扱う", async () => {
    // 不正な値を設定
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "invalid");

    const { result } = renderHook(() => useOnboardingStatus());

    // 状態を確認
    let isCompleted;
    await act(async () => {
      isCompleted = await result.current.checkIsCompleted();
    });

    expect(isCompleted).toBe(false);
  });

  test("文字列の'true'だけを完了状態として扱う", async () => {
    const testCases = [
      { value: "true", expected: true },
      { value: "false", expected: false },
      { value: "TRUE", expected: false },
      { value: "1", expected: false },
      { value: "", expected: false },
      { value: null, expected: false },
    ];

    const { result } = renderHook(() => useOnboardingStatus());

    for (const { value, expected } of testCases) {
      // 値を設定
      if (value === null) {
        await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      } else {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, value);
      }

      // 状態を確認
      let isCompleted;
      await act(async () => {
        isCompleted = await result.current.checkIsCompleted();
      });

      expect(isCompleted).toBe(expected);
    }
  });
});

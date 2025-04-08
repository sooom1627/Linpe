import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";

import {
  ONBOARDING_COMPLETE_KEY,
  useOnboardingStatus,
} from "@/shared/onboarding";

describe("オンボーディングStorage機能", () => {
  // 各テストの前にAsyncStorageをクリア
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test("初期状態ではオンボーディング未完了状態である", async () => {
    const { result } = renderHook(() => useOnboardingStatus());

    // isLoadingがfalseになるまで待機
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isOnboardingCompleted).toBe(false);
  });

  test("オンボーディング完了状態を保存できる", async () => {
    const { result } = renderHook(() => useOnboardingStatus());

    // 完了状態を保存
    await act(async () => {
      await result.current.setCompleted();
    });

    expect(result.current.isOnboardingCompleted).toBe(true);
  });

  test("AsyncStorageに直接値を設定した場合も正しく状態を取得できる", async () => {
    // AsyncStorageに直接設定
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");

    const { result } = renderHook(() => useOnboardingStatus());

    // isLoadingがfalseになるまで待機
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isOnboardingCompleted).toBe(true);
  });

  test("状態をリセットできる", async () => {
    // 最初に完了状態にする
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");

    const { result } = renderHook(() => useOnboardingStatus());

    // isLoadingがfalseになるまで待機
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // リセット
    await act(async () => {
      await result.current.resetStatus();
    });

    expect(result.current.isOnboardingCompleted).toBe(false);
  });

  test("不正な値が保存された場合は未完了として扱う", async () => {
    // 不正な値を設定
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "invalid");

    const { result } = renderHook(() => useOnboardingStatus());

    // isLoadingがfalseになるまで待機
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isOnboardingCompleted).toBe(false);
  });

  test("文字列の'true'だけを完了状態として扱う", async () => {
    const completionStateTestCases = [
      { storedValue: "true", shouldBeCompleted: true },
      { storedValue: "false", shouldBeCompleted: false },
      { storedValue: "TRUE", shouldBeCompleted: false },
      { storedValue: "1", shouldBeCompleted: false },
      { storedValue: "", shouldBeCompleted: false },
      { storedValue: null, shouldBeCompleted: false },
    ];

    for (const { storedValue, shouldBeCompleted } of completionStateTestCases) {
      // 値を設定
      if (storedValue === null) {
        await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      } else {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, storedValue);
      }

      const { result } = renderHook(() => useOnboardingStatus());

      // isLoadingがfalseになるまで待機
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isOnboardingCompleted).toBe(shouldBeCompleted);
    }
  });
});

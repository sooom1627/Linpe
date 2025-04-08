import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Session } from "@supabase/supabase-js";
import { renderHook } from "@testing-library/react-native";

import { createMockSession } from "../../../../../app/__tests__/helpers/setup";
import { useAuthRedirect } from "../useAuthRedirect";

// モック
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

describe("useAuthRedirect", () => {
  // モックの設定
  const mockReplace = jest.fn();
  const mockRouter = {
    replace: mockReplace,
  };
  let mockSegments: string[] = [];

  // テスト実行前の共通処理
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();

    // useRouterとuseSegmentsのモック実装を設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSegments as jest.Mock).mockReturnValue(mockSegments);
  });

  // テストケース：オンボーディング未完了時のリダイレクト
  test("未完了のオンボーディング状態では、オンボーディング画面にリダイレクトする", async () => {
    // AsyncStorageのモック設定
    await AsyncStorage.setItem("hasCompletedOnboarding", "false");

    // セグメントを設定（保護されたエリアにいると仮定）
    mockSegments = ["(protected)", "(tabs)"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // フックをレンダリング
    renderHook(() => useAuthRedirect(null, false));

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // オンボーディング画面へのリダイレクトが呼ばれたことを確認
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/onboarding");
  });

  // テストケース：オンボーディング完了＆未ログイン時の保護領域からのリダイレクト
  test("オンボーディング完了＆未ログイン時には、保護領域からログイン画面にリダイレクトする", async () => {
    // オンボーディング完了状態を設定
    await AsyncStorage.setItem("hasCompletedOnboarding", "true");

    // 保護領域のセグメントを設定
    mockSegments = ["(protected)", "(tabs)"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // フックをレンダリング（未ログインの状態）
    renderHook(() => useAuthRedirect(null, false));

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // ログイン画面へのリダイレクトが呼ばれたことを確認
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/loginScreen");
  });

  // テストケース：オンボーディング完了＆ログイン済みの認証領域からのリダイレクト
  test("オンボーディング完了＆ログイン済み時には、認証領域から保護領域にリダイレクトする", async () => {
    // オンボーディング完了状態を設定
    await AsyncStorage.setItem("hasCompletedOnboarding", "true");

    // 認証領域のセグメントを設定
    mockSegments = ["(auth)", "loginScreen"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // モックセッションを作成
    const mockSession: Session = createMockSession();

    // フックをレンダリング（ログイン済みの状態）
    renderHook(() => useAuthRedirect(mockSession, false));

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 保護領域へのリダイレクトが呼ばれたことを確認
    expect(mockReplace).toHaveBeenCalledWith("/(protected)/(tabs)");
  });

  // テストケース：既にオンボーディング画面にいる場合はリダイレクトしない
  test("オンボーディング未完了でも、既にオンボーディング画面にいる場合はリダイレクトしない", async () => {
    // オンボーディング未完了状態を設定
    await AsyncStorage.setItem("hasCompletedOnboarding", "false");

    // オンボーディング画面のセグメントを設定
    mockSegments = ["(auth)", "onboarding"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // フックをレンダリング
    renderHook(() => useAuthRedirect(null, false));

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // リダイレクトが呼ばれないことを確認
    expect(mockReplace).not.toHaveBeenCalled();
  });

  // テストケース：ローディング中はリダイレクトしない
  test("ローディング中はリダイレクトしない", async () => {
    // セグメントを設定
    mockSegments = ["(protected)", "(tabs)"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // フックをレンダリング（ローディング中の状態）
    renderHook(() => useAuthRedirect(null, true));

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // リダイレクトが呼ばれないことを確認
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

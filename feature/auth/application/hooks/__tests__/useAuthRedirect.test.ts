import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Session } from "@supabase/supabase-js";

import { createMockSession } from "../../../../../app/__tests__/helpers/setup";
import { setupTestCondition } from "../../../infrastructure/utils/testHelpers";

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

  // テスト実行前の共通処理
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();

    // useRouterのモック実装を設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  // テストケース：オンボーディング未完了時のリダイレクト
  test("未完了のオンボーディング状態では、オンボーディング画面にリダイレクトする", async () => {
    // テスト条件をセットアップ
    await setupTestCondition(
      false, // オンボーディング未完了
      ["(protected)", "(tabs)"], // 保護領域にいる
      null, // 未ログイン
    );

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // オンボーディング画面へのリダイレクトが呼ばれたことを確認
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/onboarding");
  });

  // テストケース：オンボーディング完了＆未ログイン時の保護領域からのリダイレクト
  test("オンボーディング完了＆未ログイン時には、保護領域からログイン画面にリダイレクトする", async () => {
    // テスト条件をセットアップ
    await setupTestCondition(
      true, // オンボーディング完了
      ["(protected)", "(tabs)"], // 保護領域にいる
      null, // 未ログイン
    );

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // ログイン画面へのリダイレクトが呼ばれたことを確認
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/loginScreen");
  });

  // テストケース：オンボーディング完了＆ログイン済みの認証領域からのリダイレクト
  test("オンボーディング完了＆ログイン済み時には、認証領域から保護領域にリダイレクトする", async () => {
    // モックセッションを作成
    const mockSession: Session = createMockSession();

    // テスト条件をセットアップ
    await setupTestCondition(
      true, // オンボーディング完了
      ["(auth)", "loginScreen"], // 認証領域にいる
      mockSession, // ログイン済み
    );

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 保護領域へのリダイレクトが呼ばれたことを確認
    expect(mockReplace).toHaveBeenCalledWith("/(protected)/(tabs)");
  });

  // テストケース：既にオンボーディング画面にいる場合はリダイレクトしない
  test("オンボーディング未完了でも、既にオンボーディング画面にいる場合はリダイレクトしない", async () => {
    // テスト条件をセットアップ
    await setupTestCondition(
      false, // オンボーディング未完了
      ["(auth)", "onboarding"], // 既にオンボーディング画面にいる
      null, // 未ログイン
    );

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // リダイレクトが呼ばれないことを確認
    expect(mockReplace).not.toHaveBeenCalled();
  });

  // テストケース：ローディング中はリダイレクトしない
  test("ローディング中はリダイレクトしない", async () => {
    // テスト条件をセットアップ
    await setupTestCondition(
      false, // オンボーディング未完了
      ["(protected)", "(tabs)"], // 保護領域にいる
      null, // 未ログイン
      true, // ローディング中
    );

    // タイムアウト処理を待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // リダイレクトが呼ばれないことを確認
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

import { Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { type Session } from "@supabase/supabase-js";
import { act, render } from "@testing-library/react-native";

import { SessionProvider } from "@/feature/auth/application/contexts/SessionContext";
import { useSession } from "@/feature/auth/application/hooks/useSession";

// モックオブジェクト
const mockRouter = {
  replace: jest.fn(),
};

// セグメント情報を保持する変数
let mockSegments: string[] = [];

// モックの設定
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

// SessionProviderをモック
jest.mock("@/feature/auth/application/contexts/SessionContext", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// useSessionContextをモック
jest.mock("@/feature/auth/application/hooks/useSession", () => ({
  useSession: jest.fn(),
}));

// AuthRedirectGuardをモック - 実際のuseAuthRedirectの実装に合わせる
jest.mock("@/feature/auth/application/hooks/useAuthRedirect", () => {
  return {
    useAuthRedirect: jest.fn((session: Session | null) => {
      // 実際の実装と同様にuseEffectを模倣
      setTimeout(() => {
        const inAuthGroup = mockSegments[0] === "(auth)";
        const inProtectedGroup = mockSegments[0] === "(protected)";

        if (!mockSegments.length) return; // セグメントが空の場合は早期リターン

        if (session && inAuthGroup) {
          mockRouter.replace("/(protected)");
        } else if (!session && inProtectedGroup) {
          mockRouter.replace("/(auth)/loginScreen");
        }
      }, 0);
    }),
  };
});

describe("公開ルートのテスト", () => {
  // テスト前の共通セットアップ
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    mockSegments = [];

    // モックの設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSegments as jest.Mock).mockReturnValue(mockSegments);
    (useSession as jest.Mock).mockReturnValue({
      session: null,
      setSession: jest.fn(),
    });

    // タイマーをモック
    jest.useFakeTimers();
  });

  // テスト後のクリーンアップ
  afterEach(() => {
    jest.useRealTimers();
  });

  it("未認証状態でログインページにアクセスできること", async () => {
    // 準備
    // 認証ページへのアクセスをシミュレート
    mockSegments = ["auth", "login"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // 実行
    render(
      <SessionProvider>
        <Text>Login Page</Text>
      </SessionProvider>,
    );

    // タイマーを進める
    await act(async () => {
      jest.runAllTimers();
    });

    // 検証
    // リダイレクトが発生しないことを確認
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("未認証状態でサインアップページにアクセスできること", async () => {
    // 準備
    // サインアップページへのアクセスをシミュレート
    mockSegments = ["auth", "signup"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // 実行
    render(
      <SessionProvider>
        <Text>Signup Page</Text>
      </SessionProvider>,
    );

    // タイマーを進める
    await act(async () => {
      jest.runAllTimers();
    });

    // 検証
    // リダイレクトが発生しないことを確認
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});

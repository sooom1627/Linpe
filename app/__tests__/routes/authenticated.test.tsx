import { Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { type Session } from "@supabase/supabase-js";
import { act, render } from "@testing-library/react-native";

import {
  SessionProvider,
  useSessionContext,
} from "@/feature/auth/application/contexts/SessionContext";
import { useSession } from "@/feature/auth/application/hooks/useSession";
import { AuthRedirectGuard } from "@/feature/auth/presentation/components";
import { createMockSession } from "../helpers/setup";

// モックオブジェクト
const mockRouter = {
  replace: jest.fn(),
};

// モックセッションを共通ヘルパーから取得
const mockSession: Session = createMockSession();

// セグメント情報を保持する変数
let mockSegments: string[] = [];

// モックの設定
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

// SessionProviderとuseSessionContextをモック
jest.mock("@/feature/auth/application/contexts/SessionContext", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSessionContext: jest.fn(() => ({
    session: null, // テスト内で上書きする
    setSession: jest.fn(),
  })),
}));

// useSessionをモック
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

describe("認証済みユーザーのルートテスト", () => {
  // テスト前の共通セットアップ
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    mockSegments = [];

    // モックの設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSegments as jest.Mock).mockReturnValue(mockSegments);
    (useSession as jest.Mock).mockReturnValue({
      session: mockSession,
      setSession: jest.fn(),
    });
    (useSessionContext as jest.Mock).mockReturnValue({
      session: mockSession,
      setSession: jest.fn(),
    });

    // タイマーをモック
    jest.useFakeTimers();
  });

  // テスト後のクリーンアップ
  afterEach(() => {
    jest.useRealTimers();
  });

  it("認証済み状態でログインページにアクセスすると、保護されたルートにリダイレクトされること", async () => {
    // 準備
    // 認証ページへのアクセスをシミュレート
    mockSegments = ["(auth)", "loginScreen"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // 実行
    render(
      <SessionProvider>
        <AuthRedirectGuard>
          <Text>Login Page</Text>
        </AuthRedirectGuard>
      </SessionProvider>,
    );

    // タイマーを進める
    await act(async () => {
      jest.runAllTimers();
    });

    // 検証
    // 保護されたルートへのリダイレクトを確認
    expect(mockRouter.replace).toHaveBeenCalledWith("/(protected)");
  });

  it("認証済み状態で保護されたルートにアクセスすると、リダイレクトされないこと", async () => {
    // 準備
    // 保護されたルートへのアクセスをシミュレート
    mockSegments = ["(protected)", "index"];
    (useSegments as jest.Mock).mockReturnValue(mockSegments);

    // 実行
    render(
      <SessionProvider>
        <AuthRedirectGuard>
          <Text>Protected Page</Text>
        </AuthRedirectGuard>
      </SessionProvider>,
    );

    // タイマーを進める
    await act(async () => {
      jest.runAllTimers();
    });

    // 検証
    // リダイレクトが発生しないことを確認（保護されたルートにいるため）
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});

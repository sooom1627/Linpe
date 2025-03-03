import { Text } from "react-native";
import { type Session } from "@supabase/supabase-js";
import { act, render, waitFor } from "@testing-library/react-native";

import {
  SessionProvider,
  useSessionContext,
} from "@/feature/auth/application/contexts/SessionContext";
import { AuthRedirectGuard } from "@/feature/auth/presentation/components/guard/AuthRedirectGuard";
import {
  createMockRouter,
  createMockSession,
  getMockSegments,
} from "./helpers/setup";

// モックの設定
const mockSegments = getMockSegments();
const mockRouter = createMockRouter();
const mockReplace = jest.fn();

// モックの設定
jest.mock("@/feature/auth/application/contexts/SessionContext", () => {
  const actual = jest.requireActual(
    "@/feature/auth/application/contexts/SessionContext",
  );
  return {
    ...actual,
    useSessionContext: jest.fn(() => ({
      session: null,
      setSession: jest.fn(),
    })),
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({
    ...mockRouter,
    replace: (path: string) => {
      mockReplace(path);
    },
  }),
  useSegments: () => ({
    ...mockSegments,
    get: () => mockSegments.segments,
  }),
}));

// AuthRedirectGuardをモック
jest.mock("@/feature/auth/application/hooks/useAuthRedirect", () => ({
  useAuthRedirect: (session: Session | null) => {
    const segments = mockSegments.segments;
    const inProtectedGroup = segments[0] === "(protected)";
    if (!session && inProtectedGroup) {
      setTimeout(() => {
        mockReplace("/(auth)/loginScreen");
      }, 0);
    }
  },
}));

describe("Protected Routes Tests", () => {
  // テスト前の共通セットアップ
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    mockSegments.segments = []; // セグメントをリセット
    jest.useFakeTimers();

    // セッション状態のモックをリセット
    (useSessionContext as jest.Mock).mockImplementation(() => ({
      session: null,
      setSession: jest.fn(),
    }));
  });

  // テスト後のクリーンアップ
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Unauthenticated Access", () => {
    it("未認証状態で保護されたルートにアクセスすると、ログイン画面にリダイレクトされること", async () => {
      // 準備
      // セッションが未認証であることを確認
      expect(useSessionContext()).toEqual({
        session: null,
        setSession: expect.any(Function),
      });

      // 保護されたルートへのアクセスをシミュレート
      mockSegments.segments = ["(protected)"];

      // 実行
      render(
        <SessionProvider>
          <AuthRedirectGuard>
            <Text>Protected Page</Text>
          </AuthRedirectGuard>
        </SessionProvider>,
      );

      // コンポーネントのマウントを待つ
      await act(async () => {
        await Promise.resolve();
      });

      // setTimeoutの処理を実行
      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      // 検証
      // リダイレクトの発生を確認
      await waitFor(
        () => {
          expect(mockReplace).toHaveBeenCalledWith("/(auth)/loginScreen");
        },
        { timeout: 1000 },
      );
    });

    it("認証済み状態で保護されたルートにアクセスすると、リダイレクトされないこと", async () => {
      // 準備
      // セッションが認証済みであることをモック
      const mockSession = createMockSession();
      (useSessionContext as jest.Mock).mockImplementation(() => ({
        session: mockSession,
        setSession: jest.fn(),
      }));

      // 保護されたルートへのアクセスをシミュレート
      mockSegments.segments = ["(protected)"];

      // 実行
      render(
        <SessionProvider>
          <AuthRedirectGuard>
            <Text>Protected Page</Text>
          </AuthRedirectGuard>
        </SessionProvider>,
      );

      // コンポーネントのマウントを待つ
      await act(async () => {
        await Promise.resolve();
      });

      // setTimeoutの処理を実行
      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      // 検証
      // リダイレクトが発生しないことを確認
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});

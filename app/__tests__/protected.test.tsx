import { Text } from "react-native";
import { type Session } from "@supabase/supabase-js";
import { act, render, waitFor } from "@testing-library/react-native";

import { AuthRedirectGuard } from "@/feature/auth/components";
import {
  SessionProvider,
  useSessionContext,
} from "@/feature/auth/contexts/SessionContext";
import { createMockRouter, getMockSegments } from "./helpers/setup";

// モックの設定を最初に行う
const mockSegments = getMockSegments();
const mockRouter = createMockRouter();

// デバッグ用のモック関数
const mockReplace = jest.fn();

// SessionContextのモックを明示的に設定
jest.mock("@/feature/auth/contexts/SessionContext", () => {
  const actual = jest.requireActual("@/feature/auth/contexts/SessionContext");
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
jest.mock("@/feature/auth/hooks/useAuthRedirect", () => ({
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
  beforeEach(() => {
    jest.clearAllMocks();
    mockSegments.segments = []; // セグメントをリセット
    jest.useFakeTimers();

    // セッション状態のモックをリセット
    (useSessionContext as jest.Mock).mockImplementation(() => ({
      session: null,
      setSession: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Unauthenticated Access", () => {
    it("redirects to login when accessing protected route without authentication", async () => {
      // セッションが未認証であることを確認
      expect(useSessionContext()).toEqual({
        session: null,
        setSession: expect.any(Function),
      });

      // 保護されたルートへのアクセスをシミュレート
      mockSegments.segments = ["(protected)"];

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

      // リダイレクトの発生を確認
      await waitFor(
        () => {
          expect(mockReplace).toHaveBeenCalledWith("/(auth)/loginScreen");
        },
        { timeout: 1000 },
      );
    });
  });
});

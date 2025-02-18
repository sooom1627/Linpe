import { Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { type Session } from "@supabase/supabase-js";
import { act, render } from "@testing-library/react-native";

import { SessionProvider } from "@/feature/auth/application/contexts/SessionContext";
import { useSession } from "@/feature/auth/application/hooks/useSession";
import { AuthRedirectGuard } from "@/feature/auth/presentation/components";

const mockRouter = {
  replace: jest.fn(),
};

const mockSession: Session = {
  user: {
    id: "test-user",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00.000Z",
    role: "authenticated",
    email: "test@example.com",
  },
  access_token: "test-token",
  refresh_token: "test-refresh-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 1234567890,
};

// モックの設定
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
  useSegments: jest.fn(),
}));

// SessionProviderとuseSessionContextをモック
jest.mock("@/feature/auth/contexts/SessionContext", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSessionContext: jest.fn(() => ({
    session: mockSession,
    setSession: jest.fn(),
  })),
}));

// useSessionをモック
jest.mock("@/feature/auth/hooks/useSession", () => ({
  useSession: jest.fn(),
}));

// AuthRedirectGuardをモック
jest.mock("@/feature/auth/hooks/useAuthRedirect", () => {
  return {
    useAuthRedirect: jest.fn((session: Session | null) => {
      if (session) {
        setTimeout(() => {
          mockRouter.replace("/(protected)");
        }, 0);
      }
    }),
  };
});

describe("Authenticated User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.useFakeTimers();

    // useSessionのモックを設定
    (useSession as jest.Mock).mockReturnValue({
      session: mockSession,
      setSession: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("redirects to protected route when accessing login page while authenticated", () => {
    (useSegments as jest.Mock).mockReturnValue(["(auth)", "loginScreen"]);

    render(
      <SessionProvider>
        <AuthRedirectGuard>
          <Text>Login Page</Text>
        </AuthRedirectGuard>
      </SessionProvider>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(mockRouter.replace).toHaveBeenCalledWith("/(protected)");
  });
});

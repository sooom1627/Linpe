import { Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { act, render } from "@testing-library/react-native";

import { SessionProvider } from "@/feature/auth/application/contexts/SessionContext";

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
  useSession: jest.fn(() => ({
    session: null,
    setSession: jest.fn(),
  })),
}));

describe("Public Routes", () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows access to login page when not authenticated", () => {
    (useSegments as jest.Mock).mockReturnValue(["auth", "login"]);

    render(
      <SessionProvider>
        <Text>Login Page</Text>
      </SessionProvider>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("allows access to signup page when not authenticated", () => {
    (useSegments as jest.Mock).mockReturnValue(["auth", "signup"]);

    render(
      <SessionProvider>
        <Text>Signup Page</Text>
      </SessionProvider>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});

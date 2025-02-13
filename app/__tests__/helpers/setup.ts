import { type ReactNode } from "react";
import { type Session } from "@supabase/supabase-js";

// モックの設定
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

// SessionProviderをモック
jest.mock("@/feature/auth/contexts/SessionContext", () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => children,
}));

// useSessionContextをモック
jest.mock("@/feature/auth/hooks/useSession", () => ({
  useSession: jest.fn(() => ({
    session: null,
    setSession: jest.fn(),
  })),
}));

export const createMockRouter = () => ({
  replace: jest.fn(),
});

export const createMockSession = (): Session => ({
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
});

import { type ReactNode } from "react";
import { jest } from "@jest/globals";
import { type Session } from "@supabase/supabase-js";

// expo-routerのモックを作成
const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
  canGoBack: () => true,
};

const mockUseRouter = jest.fn(() => mockRouter);

// useSegmentsの戻り値に必要なプロパティを追加
const mockSegments: {
  segments: string[];
  isReady: boolean;
  getSegments: () => string[];
  getPathname: () => string;
  [Symbol.iterator]: () => Generator<string>;
} = {
  segments: [],
  isReady: true,
  getSegments: function () {
    return this.segments;
  },
  getPathname: function () {
    return this.segments.join("/");
  },
  [Symbol.iterator]: function* () {
    yield* this.segments;
  },
};

// useSegmentsの実装をモック
const mockUseSegments = jest.fn(() => ({
  ...mockSegments,
  get: () => mockSegments.segments,
}));

// モックの設定
jest.mock("expo-router", () => ({
  useRouter: mockUseRouter,
  useSegments: mockUseSegments,
}));

// SessionProviderをモック
jest.mock("@/feature/auth/application/contexts/SessionContext", () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => children,
}));

// useSessionContextをモック
jest.mock("@/feature/auth/application/hooks/useSession", () => ({
  useSession: jest.fn(() => ({
    session: null,
    setSession: jest.fn(),
  })),
}));

export const createMockRouter = () => mockRouter;
export const getMockUseRouter = () => mockUseRouter;
export const getMockUseSegments = () => mockUseSegments;
export const getMockSegments = () => mockSegments;

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

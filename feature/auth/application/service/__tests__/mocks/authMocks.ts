// モックの共通化と型安全性の向上
import { Alert } from "react-native";

// セッションの型定義
interface Session {
  [key: string]: unknown;
}

// supabaseのモック
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
};

// モック設定
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock("@/lib/supabase", () => mockSupabase);

// テスト前にモックをリセット
beforeEach(() => {
  jest.clearAllMocks();
});

/**
 * 認証エラーレスポンスを生成する
 * @param message エラーメッセージ
 * @returns エラーを含むレスポンスオブジェクト
 */
export const createErrorResponse = (message: string) => ({
  error: { message },
});

/**
 * 認証成功レスポンスを生成する
 * @param session セッションオブジェクト（nullの場合はセッションなし）
 * @returns 成功レスポンスオブジェクト
 */
export const createSuccessResponse = (session: Session | null = {}) => ({
  data: { session },
  error: null,
});

export { Alert, mockSupabase as supabase };

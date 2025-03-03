// プレゼンテーション層のコンポーネントテスト用のモック

// Expoのフォントモック
jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
  Font: {
    isLoaded: jest.fn(() => true),
  },
}));

// アイコンコンポーネントのモック
export const mockLogoutIcon = jest.fn().mockImplementation(() => null);

// authServiceのモック
export const mockAuthService = {
  signout: jest.fn(),
  loginWithEmail: jest.fn(),
  signupWithEmail: jest.fn(),
};

// テスト用のヘルパー関数
/**
 * テスト用のプロップスを生成する
 * @param overrides 上書きするプロップス
 * @returns デフォルト値とオーバーライドを組み合わせたプロップス
 */
export function createTestProps<T extends object>(
  overrides: Partial<T> = {},
): T {
  return {
    ...overrides,
  } as T;
}

// 認証サービスの引数の型
type LoginParams = [string, string, (loading: boolean) => void];
type SignupParams = [string, string, (loading: boolean) => void];

// モックのセットアップ
jest.mock("@/components/icons/LogoutIcon", () => ({
  LogoutIcon: () => null,
}));

jest.mock("@/feature/auth/application/service/authService", () => ({
  signout: () => mockAuthService.signout(),
  loginWithEmail: (...args: LoginParams) =>
    mockAuthService.loginWithEmail(...args),
  signupWithEmail: (...args: SignupParams) =>
    mockAuthService.signupWithEmail(...args),
}));

// テスト前にモックをリセット
beforeEach(() => {
  jest.clearAllMocks();
});

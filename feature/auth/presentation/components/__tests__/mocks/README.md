# プレゼンテーション層テスト用モック

このディレクトリには、認証機能のプレゼンテーション層（コンポーネントとスクリーン）のテストで使用するモックが定義されています。

## モックの概要

`componentMocks.ts` ファイルには、以下のモックが定義されています：

1. **アイコンコンポーネントのモック**: `LogoutIcon` などのアイコンコンポーネントをモック化
2. **認証サービスのモック**: `signout`、`loginWithEmail`、`signupWithEmail` などの認証サービス関数をモック化
3. **テスト用ヘルパー関数**: テストデータ生成を簡素化するユーティリティ関数

## モックの使用方法

### モックのインポート

```typescript
import { mockAuthService, mockLogoutIcon, createTestProps } from "./mocks/componentMocks";
```

### 認証サービスのモック設定

```typescript
// 成功時の動作をモック
mockAuthService.signout.mockResolvedValue(undefined);

// エラー時の動作をモック
mockAuthService.loginWithEmail.mockImplementation((email, password, setLoading) => {
  setLoading(true);
  // 処理
  setLoading(false);
});
```

### テストプロップスの生成

```typescript
// コンポーネントのプロップス型
type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
};

// デフォルト値を上書きしてテスト用プロップスを生成
const props = createTestProps<EmailInputProps>({
  email: "test@example.com",
  setEmail: jest.fn(),
});
```

## モックの実装詳細

```typescript
// アイコンコンポーネントのモック
export const mockLogoutIcon = jest.fn().mockImplementation(() => null);

// authServiceのモック
export const mockAuthService = {
  signout: jest.fn(),
  loginWithEmail: jest.fn(),
  signupWithEmail: jest.fn(),
};

// テスト用のヘルパー関数
export function createTestProps<T extends object>(overrides: Partial<T> = {}): T {
  return {
    ...overrides,
  } as T;
}
```

## ベストプラクティス

1. **テスト間でモックをリセット**: `beforeEach` で `jest.clearAllMocks()` を呼び出し、テスト間でモックの状態をリセットする
2. **型安全なモック**: 型定義を使用して、モックの型安全性を確保する
3. **ヘルパー関数の活用**: 共通のモックパターンをヘルパー関数として抽象化し、テストコードを簡潔にする
4. **明示的なモック設定**: 各テストで明示的にモックの動作を設定し、テストの意図を明確にする 
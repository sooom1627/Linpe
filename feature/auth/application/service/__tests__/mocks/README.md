# 認証サービステスト用モック

このディレクトリには、認証サービスのテストで使用するモックが定義されています。

## モックの概要

`authMocks.ts` ファイルには、以下のモックが定義されています：

1. **Alert モック**: React Native の `Alert.alert` 関数をモック化
2. **supabase モック**: Supabase クライアントの認証関連メソッドをモック化
3. **ヘルパー関数**: テストデータ生成を簡素化するユーティリティ関数

## モックの使用方法

### モックのインポート

```typescript
import {
  Alert,
  createErrorResponse,
  createSuccessResponse,
  supabase,
} from "./mocks/authMocks";
```

### 成功レスポンスの設定

```typescript
// セッションありの成功レスポンス
supabase.auth.signInWithPassword.mockResolvedValue(
  createSuccessResponse({ user: { id: "123" } }),
);

// セッションなしの成功レスポンス
supabase.auth.signUp.mockResolvedValue(createSuccessResponse(null));
```

### エラーレスポンスの設定

```typescript
// エラーメッセージを指定
const errorMessage = "認証エラーが発生しました";
supabase.auth.signOut.mockResolvedValue(createErrorResponse(errorMessage));
```

### Alert モックの検証

```typescript
// Alert.alert が呼ばれたことを検証
expect(Alert.alert).toHaveBeenCalledWith("エラーメッセージ");

// Alert.alert が呼ばれなかったことを検証
expect(Alert.alert).not.toHaveBeenCalled();
```

## モックの実装詳細

```typescript
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

// エラーレスポンスを生成する関数
export const createErrorResponse = (message: string) => ({
  error: { message },
});

// 成功レスポンスを生成する関数
export const createSuccessResponse = (session: Session | null = {}) => ({
  data: { session },
  error: null,
});
```

## ベストプラクティス

1. **テスト間でモックをリセット**: `beforeEach` で `jest.clearAllMocks()`
   を呼び出し、テスト間でモックの状態をリセットする
2. **型安全なモック**: 型定義を使用して、モックの型安全性を確保する
3. **ヘルパー関数の活用**: 共通のモックパターンをヘルパー関数として抽象化し、テストコードを簡潔にする
4. **明示的なモック設定**: 各テストで明示的にモックの動作を設定し、テストの意図を明確にする

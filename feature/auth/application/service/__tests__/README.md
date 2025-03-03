# 認証サービステスト

このディレクトリには、認証関連のサービス（`authService.ts`）に対するテストが含まれています。

## テスト対象

- `loginWithEmail`: メールアドレスとパスワードによるログイン機能
- `signupWithEmail`: メールアドレスとパスワードによるサインアップ機能
- `signout`: ログアウト機能

## テスト構造

各テストファイルは以下の構造に従っています：

1. **準備（Arrange）**: テストデータとモックの設定
2. **実行（Act）**: テスト対象の関数を実行
3. **検証（Assert）**: 期待される結果の確認

## モックの実装

`mocks/authMocks.ts` には、テストで使用する共通のモックが定義されています：

- `Alert`: React Nativeのアラート表示をモック化
- `supabase`: Supabaseクライアントをモック化
- `createErrorResponse`: エラーレスポンスを生成するヘルパー関数
- `createSuccessResponse`: 成功レスポンスを生成するヘルパー関数

## テスト実装例

```typescript
// モックのインポート
import { Alert, supabase, createErrorResponse, createSuccessResponse } from "./mocks/authMocks";

describe("loginWithEmail", () => {
  // テスト共通のデータ
  const email = "test@example.com";
  const password = "password123";
  let setLoading: jest.Mock;

  beforeEach(() => {
    // 各テスト前に初期化
    setLoading = jest.fn();
  });

  it("正常時は setLoading が true と false で呼ばれ、Alert は呼ばれない", async () => {
    // 準備
    supabase.auth.signInWithPassword.mockResolvedValue(createSuccessResponse());

    // 実行
    await loginWithEmail(email, password, setLoading);

    // 検証
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
```

## テスト実行方法

```bash
# 特定のテストファイルを実行
npx jest feature/auth/application/service/__tests__/loginWithEmail.test.ts

# 認証サービスのすべてのテストを実行
npx jest feature/auth/application/service

# カバレッジレポートの生成
npx jest feature/auth/application/service --coverage
```

## ベストプラクティス

1. **テストケースの分離**: 各テストケースは独立して実行できるようにする
2. **モックの適切な使用**: 外部依存をモック化して、テストの信頼性を高める
3. **共通のセットアップ**: `beforeEach` を使用して、テスト間で共通のセットアップを行う
4. **ヘルパー関数の活用**: `createErrorResponse` や `createSuccessResponse` のようなヘルパー関数を使用して、テストコードを簡潔にする
5. **明確なアサーション**: 期待される結果を具体的に指定し、何をテストしているかを明確にする 
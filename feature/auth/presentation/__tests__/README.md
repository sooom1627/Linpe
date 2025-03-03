# 認証機能プレゼンテーション層テスト

このディレクトリには、認証機能のプレゼンテーション層（コンポーネントとスクリーン）に対するテストが含まれています。

## テスト対象

### コンポーネント
- `EmailInput`: メールアドレス入力フォーム
- `PasswordInput`: パスワード入力フォーム
- `SignOutButton`: ログアウトボタン

### スクリーン
- `Login`: ログイン画面

## テスト構造

各テストファイルは以下の構造に従っています：

1. **準備（Arrange）**: テストデータとモックの設定
2. **実行（Act）**: テスト対象のコンポーネントをレンダリングし、ユーザー操作をシミュレート
3. **検証（Assert）**: 期待される結果の確認

## モックの実装

`components/__tests__/mocks/componentMocks.ts` には、テストで使用する共通のモックが定義されています：

- `mockLogoutIcon`: アイコンコンポーネントのモック
- `mockAuthService`: 認証サービス関数のモック
- `createTestProps`: テスト用プロップスを生成するヘルパー関数

## テスト実装例

### コンポーネントテスト

```typescript
import { fireEvent, render } from "@testing-library/react-native";
import { EmailInput } from "../form/EmailInput";
import { createTestProps } from "./mocks/componentMocks";

describe("EmailInput", () => {
  it("handles input changes", () => {
    // 準備
    const setEmail = jest.fn();
    const props = createTestProps({
      email: "",
      setEmail,
    });

    // 実行
    const { getByLabelText } = render(<EmailInput {...props} />);
    const input = getByLabelText("Email");
    fireEvent.changeText(input, "test@example.com");

    // 検証
    expect(setEmail).toHaveBeenCalledWith("test@example.com");
  });
});
```

### スクリーンテスト

```typescript
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Login } from "../Login";
import { mockAuthService } from "../../components/__tests__/mocks/componentMocks";

describe("Login Screen", () => {
  it("handles form submission", async () => {
    // 準備
    mockAuthService.loginWithEmail.mockImplementation();

    // 実行
    const { getByLabelText, getByTestId } = render(<Login />);
    fireEvent.changeText(getByLabelText("Email"), "test@example.com");
    fireEvent.changeText(getByLabelText("Password"), "password123");
    fireEvent.press(getByTestId("login-button"));

    // 検証
    await waitFor(() => {
      expect(mockAuthService.loginWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        expect.any(Function),
      );
    });
  });
});
```

## テスト実行方法

```bash
# 特定のコンポーネントのテストを実行
npx jest feature/auth/presentation/components/__tests__/EmailInput.test.tsx

# 特定のスクリーンのテストを実行
npx jest feature/auth/presentation/screen/__tests__/Login.test.tsx

# プレゼンテーション層のすべてのテストを実行
npx jest feature/auth/presentation

# カバレッジレポートの生成
npx jest feature/auth/presentation --coverage
```

## ベストプラクティス

1. **コンポーネントの分離**: 各コンポーネントは独立してテスト可能にする
2. **モックの適切な使用**: 外部依存をモック化して、テストの信頼性を高める
3. **ユーザー操作のシミュレーション**: `fireEvent` を使用して、実際のユーザー操作をシミュレートする
4. **アクセシビリティラベルの活用**: テスト対象の要素を特定するために、アクセシビリティラベルを使用する
5. **非同期処理の適切な扱い**: `waitFor` や `act` を使用して、非同期処理を適切に扱う 
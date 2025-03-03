# 認証機能テスト戦略

このドキュメントでは、認証機能のテスト戦略と実装方法について詳細に説明します。

## テスト対象コンポーネント

認証機能は以下のコンポーネントで構成されています：

### アプリケーション層

- **サービス**: `authService.ts`（ログイン、サインアップ、ログアウト機能）
- **コンテキスト**: 認証状態管理
- **フック**: 認証状態へのアクセス

### プレゼンテーション層

- **コンポーネント**: 入力フォーム、ボタンなど
- **スクリーン**: ログイン画面、サインアップ画面など

## テスト実装状況

| コンポーネント           | テストファイル            | 実装状況 | カバレッジ |
| ------------------------ | ------------------------- | -------- | ---------- |
| **アプリケーション層**   |
| `loginWithEmail`         | `loginWithEmail.test.ts`  | ✅       | 100%       |
| `signupWithEmail`        | `signupWithEmail.test.ts` | ✅       | 100%       |
| `signout`                | `signout.test.ts`         | ✅       | 100%       |
| **プレゼンテーション層** |
| `EmailInput`             | `EmailInput.test.tsx`     | ✅       | 100%       |
| `PasswordInput`          | `PasswordInput.test.tsx`  | ✅       | 100%       |
| `SignOutButton`          | `SignOutButton.test.tsx`  | ✅       | 100%       |
| `Login`                  | `Login.test.tsx`          | ✅       | 80%        |

## テスト実装例

### アプリケーション層のテスト

#### サービステスト例（`loginWithEmail.test.ts`）

```typescript
import {
  Alert,
  createErrorResponse,
  createSuccessResponse,
  supabase,
} from "./mocks/authMocks";

// 遅延読み込みを使用
const { loginWithEmail } = jest.requireActual("../authService");

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

### プレゼンテーション層のテスト

#### コンポーネントテスト例（`EmailInput.test.tsx`）

```typescript
import { fireEvent, render } from "@testing-library/react-native";
import { EmailInput } from "../form/EmailInput";
import { createTestProps } from "./mocks/componentMocks";

describe("EmailInput", () => {
  // テスト共通のデータ
  const defaultEmail = "test@example.com";

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
    fireEvent.changeText(input, defaultEmail);

    // 検証
    expect(setEmail).toHaveBeenCalledWith(defaultEmail);
  });
});
```

#### スクリーンテスト例（`Login.test.tsx`）

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

## モック戦略

### Supabaseクライアントのモック

認証サービスのテストでは、Supabaseクライアントをモック化して、外部依存を排除しています：

```typescript
// モックの共通化と型安全性の向上
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
};

// ヘルパー関数
export const createErrorResponse = (message: string) => ({
  error: { message },
});

export const createSuccessResponse = (session: Session | null = {}) => ({
  data: { session },
  error: null,
});
```

### UIコンポーネントのモック

プレゼンテーション層のテストでは、アイコンコンポーネントや認証サービスをモック化しています：

```typescript
// アイコンコンポーネントのモック
jest.mock("@/components/icons/LogoutIcon", () => ({
  LogoutIcon: () => null,
}));

// Expoのフォントをモック
jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
  Font: {
    isLoaded: jest.fn(() => true),
  },
}));

// authServiceを直接モック
jest.mock("@/feature/auth/application/service/authService", () => ({
  signout: () => mockAuthService.signout(),
}));
```

## テスト実行方法

### 特定のテストファイルを実行

```bash
# アプリケーション層のテスト
npx jest feature/auth/application/service/__tests__/loginWithEmail.test.ts

# プレゼンテーション層のテスト
npx jest feature/auth/presentation/components/__tests__/EmailInput.test.tsx
```

### 特定のレイヤーのすべてのテストを実行

```bash
# アプリケーション層のすべてのテスト
npx jest feature/auth/application

# プレゼンテーション層のすべてのテスト
npx jest feature/auth/presentation
```

### カバレッジレポートの生成

```bash
# 認証機能全体のカバレッジレポート
npx jest feature/auth --coverage
```

## テスト作成のベストプラクティス

1. **テストケースの分離**: 各テストケースは独立して実行できるようにする
2. **準備・実行・検証の3ステップ**: テストコードを「準備（Arrange）」「実行（Act）」「検証（Assert）」の3ステップに構造化する
3. **モックの適切な使用**: 外部依存をモック化して、テストの信頼性を高める
4. **共通のセットアップ**: `beforeEach`
   を使用して、テスト間で共通のセットアップを行う
5. **ヘルパー関数の活用**: `createErrorResponse` や `createSuccessResponse`
   のようなヘルパー関数を使用して、テストコードを簡潔にする
6. **明確なアサーション**: 期待される結果を具体的に指定し、何をテストしているかを明確にする

## 今後の改善点

1. **テストカバレッジの向上**:

   - 認証コンテキストのテスト追加
   - カスタムフックのテスト追加
   - エラー処理のテスト強化

2. **E2Eテストの導入**:

   - Detoxを使用したエンドツーエンドテストの実装
   - 実際のユーザーフローをシミュレートするテストシナリオの作成

3. **テスト自動化**:
   - CI/CDパイプラインでのテスト実行の設定
   - プルリクエスト時の自動テスト実行

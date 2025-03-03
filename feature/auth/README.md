# 認証機能（Auth Feature）

このディレクトリには、アプリケーションの認証機能に関連するコードが含まれています。

## 機能概要

認証機能は以下の主要な機能を提供します：

- ユーザー登録（サインアップ）
- メールアドレスとパスワードによるログイン
- ログアウト
- 認証状態の管理

## アーキテクチャ

認証機能は、クリーンアーキテクチャの原則に従って、以下のレイヤーに分かれています：

### アプリケーション層（Application Layer）

`application/` ディレクトリには、ビジネスロジックが含まれています：

- `service/`: 認証に関連するサービス関数（ログイン、サインアップ、ログアウトなど）
- `hooks/`: 認証状態を管理するカスタムフック
- `contexts/`: 認証状態をアプリケーション全体で共有するためのコンテキスト

### プレゼンテーション層（Presentation Layer）

`presentation/` ディレクトリには、UIコンポーネントが含まれています：

- `components/`: 認証関連のUIコンポーネント（入力フォーム、ボタンなど）
- `screen/`: 認証関連の画面（ログイン画面、サインアップ画面など）

## データフロー

1. ユーザーがUIコンポーネント（例：ログインフォーム）を操作
2. プレゼンテーション層がアプリケーション層のサービス関数を呼び出す
3. サービス関数がSupabaseクライアントを使用して認証操作を実行
4. 認証状態の変更がコンテキストを通じてアプリケーション全体に伝播

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Presentation   │      │   Application    │      │  Infrastructure  │
│     Layer       │─────▶│      Layer       │─────▶│      Layer       │
│ (Components,    │      │ (Services,       │      │ (Supabase        │
│  Screens)       │◀─────│  Hooks, Context) │◀─────│  Client)         │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## テスト戦略

認証機能のテストは、各レイヤーごとに異なるアプローチで実装されています：

### アプリケーション層のテスト

`application/service/__tests__/`
ディレクトリには、サービス関数のユニットテストが含まれています：

- `loginWithEmail.test.ts`: ログイン機能のテスト
- `signupWithEmail.test.ts`: サインアップ機能のテスト
- `signout.test.ts`: ログアウト機能のテスト

これらのテストでは、Supabaseクライアントをモック化して、サービス関数の動作を検証します。

### プレゼンテーション層のテスト

`presentation/components/__tests__/` および `presentation/screen/__tests__/`
ディレクトリには、UIコンポーネントのテストが含まれています：

- コンポーネントテスト：入力フォームやボタンなどの個別のUIコンポーネントをテスト
- スクリーンテスト：ログイン画面などの画面全体の動作をテスト

これらのテストでは、React Testing
Libraryを使用して、ユーザー操作をシミュレートし、UIの動作を検証します。

## 使用方法

### ログイン

```tsx
import { loginWithEmail } from "@/feature/auth/application/service/authService";

// コンポーネント内
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = () => {
  loginWithEmail(email, password, setLoading);
};
```

### サインアップ

```tsx
import { signupWithEmail } from "@/feature/auth/application/service/authService";

// コンポーネント内
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleSignup = () => {
  signupWithEmail(email, password, setLoading);
};
```

### ログアウト

```tsx
import { signout } from "@/feature/auth/application/service/authService";

// コンポーネント内
const handleSignout = async () => {
  await signout();
  // ログアウト後の処理
};
```

## 今後の改善点

- パスワードリセット機能の追加
- ソーシャルログイン（Google、Appleなど）の実装
- 多要素認証の導入
- エラーメッセージの多言語対応

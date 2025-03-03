# 認証機能アーキテクチャ

このドキュメントでは、認証機能のアーキテクチャと実装の詳細について説明します。

## アーキテクチャ概要

認証機能は、クリーンアーキテクチャの原則に従って、以下のレイヤーに分かれています：

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Presentation   │      │   Application    │      │  Infrastructure  │
│     Layer       │─────▶│      Layer       │─────▶│      Layer       │
│ (Components,    │      │ (Services,       │      │ (Supabase        │
│  Screens)       │◀─────│  Hooks, Context) │◀─────│  Client)         │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### インフラストラクチャ層（Infrastructure Layer）

外部サービスとの連携を担当します：

- **Supabaseクライアント**: 認証APIへのアクセスを提供

### アプリケーション層（Application Layer）

ビジネスロジックを実装します：

- **サービス**: 認証操作（ログイン、サインアップ、ログアウト）を実行
- **コンテキスト**: 認証状態を管理し、アプリケーション全体で共有
- **フック**: 認証状態へのアクセスを提供

### プレゼンテーション層（Presentation Layer）

ユーザーインターフェースを提供します：

- **コンポーネント**: 入力フォーム、ボタンなどのUI要素
- **スクリーン**: ログイン画面、サインアップ画面などの完全な画面

## ディレクトリ構造

```
feature/auth/
├── application/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── service/
│       ├── __tests__/
│       │   ├── loginWithEmail.test.ts
│       │   ├── signout.test.ts
│       │   └── signupWithEmail.test.ts
│       └── authService.ts
├── docs/
│   ├── architecture.md
│   └── testing.md
├── presentation/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── EmailInput.test.tsx
│   │   │   ├── PasswordInput.test.tsx
│   │   │   └── SignOutButton.test.tsx
│   │   ├── actions/
│   │   │   └── SignOutButton.tsx
│   │   └── form/
│   │       ├── EmailInput.tsx
│   │       └── PasswordInput.tsx
│   └── screen/
│       ├── __tests__/
│       │   └── Login.test.tsx
│       ├── Login.tsx
│       └── Signup.tsx
└── README.md
```

## 実装詳細

### 認証サービス（`authService.ts`）

認証操作を実行するサービス関数を提供します：

```typescript
// ログイン機能
export const loginWithEmail = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) Alert.alert(error.message);

  setLoading(false);
};

// サインアップ機能
export const signupWithEmail = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) Alert.alert(error.message);
  if (!session) Alert.alert("Please check your inbox for email verification!");
  setLoading(false);
};

// ログアウト機能
export const signout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) Alert.alert(error.message);
};
```

### 認証コンテキスト（`AuthContext.tsx`）

認証状態を管理し、アプリケーション全体で共有します：

```typescript
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // セッション状態の監視
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 認証フック（`useAuth.ts`）

認証状態へのアクセスを提供します：

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### ログイン画面（`Login.tsx`）

ユーザーがログインするためのインターフェースを提供します：

```typescript
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout title="Login">
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      <View className="flex-col items-center gap-2">
        <PrimaryButton
          onPress={() => loginWithEmail(email, password, setLoading)}
          loading={loading}
          testID="login-button"
        >
          <ThemedText
            text="Login"
            variant="h4"
            weight="semibold"
            color="white"
          />
        </PrimaryButton>
        <DefaultLink href="/signupScreen">
          <ThemedText
            text="Signup"
            variant="h4"
            weight="semibold"
            color="accent"
          />
        </DefaultLink>
      </View>
    </AuthLayout>
  );
};
```

## データフロー

### ログインフロー

1. ユーザーがログインフォームに認証情報を入力
2. ユーザーがログインボタンをクリック
3. `loginWithEmail` サービス関数が呼び出される
4. Supabaseクライアントが認証APIにリクエストを送信
5. 認証結果に基づいて、UI状態が更新される（ローディング状態、エラーメッセージなど）
6. 認証成功時、Supabaseの `onAuthStateChange` イベントが発火
7. `AuthContext` が新しいセッション情報で更新される
8. アプリケーションが認証済み状態に遷移

### ログアウトフロー

1. ユーザーがログアウトボタンをクリック
2. `signout` サービス関数が呼び出される
3. Supabaseクライアントがログアウトリクエストを送信
4. Supabaseの `onAuthStateChange` イベントが発火
5. `AuthContext` がセッション情報をクリア
6. アプリケーションが未認証状態に遷移

## セキュリティ考慮事項

1. **パスワードの安全な取り扱い**:

   - パスワードはクライアント側で保存しない
   - パスワードはSupabaseのセキュアな認証APIを通じて処理

2. **認証状態の保護**:

   - セッショントークンはSupabaseクライアントによって安全に管理
   - 認証状態はReactコンテキストを通じて安全に共有

3. **エラー処理**:
   - 認証エラーは適切にハンドリングし、ユーザーに通知
   - 詳細なエラー情報は開発環境でのみ表示

## 拡張性

この認証アーキテクチャは、以下の機能を追加するために拡張できます：

1. **ソーシャルログイン**:

   - Supabaseの既存のソーシャルプロバイダー（Google、Facebook、Appleなど）を統合

2. **多要素認証**:

   - Supabaseの多要素認証機能を統合

3. **パスワードリセット**:

   - パスワードリセットフローを実装

4. **ユーザープロファイル管理**:
   - ユーザープロファイル情報の取得と更新機能を追加

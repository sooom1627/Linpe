# ルーティングテスト

このディレクトリには、アプリケーションのルーティングに関連するテストが含まれています。これらのテストは、認証状態に基づいたナビゲーションの動作を検証します。

## ファイル構造

```
app/__tests__/routes/
├── authenticated.test.tsx  # 認証済みユーザーのルーティングテスト
└── public.test.tsx         # 未認証ユーザーのルーティングテスト
```

## テスト概要

### authenticated.test.tsx

認証済みユーザーのルーティング動作をテストします。主に以下のシナリオをカバーしています：

1. **認証済みユーザーがログインページにアクセスした場合**

   - 保護されたルート（`/(protected)`）に自動的にリダイレクトされることを確認

2. **認証済みユーザーが保護されたルートにアクセスした場合**
   - リダイレクトが発生せず、そのままページにアクセスできることを確認

```typescript
// テスト例
it("認証済み状態でログインページにアクセスすると、保護されたルートにリダイレクトされること", async () => {
  // 準備: 認証ページへのアクセスをシミュレート
  mockSegments = ["(auth)", "loginScreen"];

  // 実行: コンポーネントをレンダリング
  render(
    <SessionProvider>
      <AuthRedirectGuard>
        <Text>Login Page</Text>
      </AuthRedirectGuard>
    </SessionProvider>,
  );

  // タイマーを進める
  await act(async () => {
    jest.runAllTimers();
  });

  // 検証: 保護されたルートへのリダイレクトを確認
  expect(mockRouter.replace).toHaveBeenCalledWith("/(protected)");
});
```

### public.test.tsx

未認証ユーザーの公開ルートへのアクセスをテストします。主に以下のシナリオをカバーしています：

1. **未認証ユーザーがログインページにアクセスした場合**

   - リダイレクトが発生せず、ログインページにアクセスできることを確認

2. **未認証ユーザーがサインアップページにアクセスした場合**
   - リダイレクトが発生せず、サインアップページにアクセスできることを確認

```typescript
// テスト例
it("未認証状態でログインページにアクセスできること", async () => {
  // 準備: 認証ページへのアクセスをシミュレート
  mockSegments = ["auth", "login"];

  // 実行: コンポーネントをレンダリング
  render(
    <SessionProvider>
      <Text>Login Page</Text>
    </SessionProvider>,
  );

  // タイマーを進める
  await act(async () => {
    jest.runAllTimers();
  });

  // 検証: リダイレクトが発生しないことを確認
  expect(mockRouter.replace).not.toHaveBeenCalled();
});
```

## テスト実装のポイント

### モックの設定

両方のテストファイルで、以下のモックを設定しています：

1. **Expo Routerのモック**

   - `useRouter` と `useSegments` をモックして、ルーティング操作をシミュレート

2. **認証コンテキストのモック**

   - `SessionProvider` と `useSession` をモックして、認証状態をシミュレート

3. **AuthRedirectGuardのモック**
   - 実際の実装に近い形でリダイレクト動作をシミュレート

### 非同期処理のテスト

リダイレクト処理は `setTimeout`
を使用した非同期処理として実装されているため、以下の方法でテストしています：

1. **Jest のタイマーモック**

   - `jest.useFakeTimers()` でタイマーをモック
   - `jest.runAllTimers()` でタイマーを進める

2. **React Testing Library の act**
   - `act` 関数でコンポーネントの更新をシミュレート

## ベストプラクティス

1. **テストの独立性**

   - 各テストは独立して実行できるように、`beforeEach` でモックをリセット
   - テスト間で状態が共有されないように注意

2. **実際の実装に近いモック**

   - 特に `useAuthRedirect` のモックは、実際の実装に近い形で作成
   - これにより、テストの信頼性が向上

3. **明確なテスト構造**

   - 「準備」「実行」「検証」の3ステップでテストを構造化
   - コメントでテストの各ステップを明示

4. **日本語のテスト記述**
   - テストの説明は日本語で記述し、テストの目的を明確に伝える

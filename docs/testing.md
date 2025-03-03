# Linpeプロジェクトのテスト戦略

## 概要

Linpeプロジェクトでは、コードの品質と信頼性を確保するために、以下のテスト戦略を採用しています。

- **ユニットテスト**: 個々の関数やコンポーネントの動作を検証
- **統合テスト**: 複数のコンポーネントやサービスの連携を検証
- **エンドツーエンドテスト**: ユーザーの視点からアプリケーション全体の動作を検証

## テストツール

- **Jest**: テストランナーとアサーションライブラリ
- **React Testing Library**: Reactコンポーネントのテスト
- **Mock Service Worker**: APIリクエストのモック

## ディレクトリ構造

テストファイルは、テスト対象のファイルと同じディレクトリ内の `__tests__`
ディレクトリに配置します。

```
feature/
  links/
    infrastructure/
      api/
        __tests__/
          linkApi.test.ts
        linkApi.ts
    application/
      service/
        __tests__/
          linkServices.test.ts
        linkServices.ts
```

## テストの実装方法

### APIテスト

`linkApi`
のようなAPIクライアントのテストでは、Supabaseクライアントをモック化して、APIリクエストとレスポンスをシミュレートします。

```typescript
// Supabaseのモックを設定
jest.mock("@/lib/supabase", () => {
  const mockFrom = jest.fn();
  // ... その他のモック関数

  return {
    from: mockFrom,
  };
});

describe("linkApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常にデータを取得できること", async () => {
    // モックデータとレスポンスの設定
    // テスト実行
    // アサーション
  });
});
```

### サービステスト

`linkService`
のようなサービスレイヤーのテストでは、依存するAPIクライアントをモック化して、サービスの動作を検証します。

```typescript
// APIクライアントのモック
jest.mock("@/feature/links/infrastructure/api", () => ({
  linkApi: {
    fetchUserLinks: jest.fn(),
    // ... その他のAPI関数
  },
}));

describe("linkService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正しいパラメータでAPIを呼び出すこと", async () => {
    // モックの設定
    // テスト実行
    // アサーション
  });
});
```

## テストの実行方法

### 特定のテストファイルの実行

```bash
npx jest path/to/test/file.test.ts
```

### すべてのテストの実行

```bash
npm test
```

### カバレッジレポートの生成

```bash
npm test -- --coverage
```

## テスト作成のガイドライン

1. **テストケースの分離**: 各テストケースは独立して実行できるようにする
2. **モックの適切な使用**: 外部依存をモック化して、テストの信頼性を高める
3. **エッジケースのテスト**: 正常系だけでなく、エラーケースや境界値もテストする
4. **読みやすいテスト**: テストコードは自己文書化し、何をテストしているかが明確になるようにする
5. **アサーションの具体性**: 期待する結果を具体的に指定し、曖昧さを避ける

## 継続的インテグレーション

GitHubワークフローを使用して、プルリクエスト時に自動的にテストを実行します。テストが失敗した場合は、マージを防止します。

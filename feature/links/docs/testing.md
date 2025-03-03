# リンク機能のテスト

このドキュメントでは、リンク機能に関するテスト戦略と実装方法について説明します。

## テスト対象コンポーネント

リンク機能は以下のレイヤーで構成されています：

1. **インフラストラクチャ層**
   - `linkApi`: Supabaseとの通信を担当
2. **アプリケーション層**
   - `linkService`: ビジネスロジックを実装
3. **プレゼンテーション層**
   - `SwipeScreen`: ユーザーインターフェース

## テスト実装状況

| コンポーネント | テストファイル                                                     | カバレッジ   |
| -------------- | ------------------------------------------------------------------ | ------------ |
| linkApi        | `feature/links/infrastructure/api/__tests__/linkApi.test.ts`       | 主要メソッド |
| linkService    | `feature/links/application/service/__tests__/linkServices.test.ts` | 主要メソッド |
| SwipeScreen    | 未実装                                                             | -            |

## テスト実装例

### linkApiのテスト

`linkApi`のテストでは、Supabaseクライアントをモック化して、APIリクエストとレスポンスをシミュレートします。

```typescript
// Supabaseのモックを設定
jest.mock("@/lib/supabase", () => {
  // モック実装
});

describe("linkApi", () => {
  describe("fetchUserLinks", () => {
    it("正常にデータを取得できること", async () => {
      // モックデータの設定
      // テスト実行
      // アサーション
    });

    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーのモック
      // テスト実行とアサーション
    });

    it("includeReadyToReadが指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      // アサーション
    });
  });
});
```

### linkServiceのテスト

`linkService`のテストでは、`linkApi`をモック化して、サービスの動作を検証します。

```typescript
// linkApiのモック
jest.mock("@/feature/links/infrastructure/api", () => ({
  linkApi: {
    fetchUserLinks: jest.fn(),
    fetchLinks: jest.fn(),
    createLinkAndUser: jest.fn(),
  },
}));

describe("linkService", () => {
  describe("fetchSwipeableLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksを呼び出すこと", async () => {
      // モックの設定
      // テスト実行
      // アサーション
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーのモック
      // テスト実行とアサーション
    });
  });
});
```

## テストカバレッジの向上

今後、以下のテストを追加することで、テストカバレッジを向上させる予定です：

1. **SwipeScreenのテスト**

   - ユーザーインタラクションのテスト
   - データ取得と表示のテスト

2. **エラーハンドリングのテスト**

   - ネットワークエラーの処理
   - バリデーションエラーの処理

3. **エンドツーエンドテスト**
   - ユーザーフローのテスト
   - 実際のAPIとの統合テスト

## テスト実行方法

```bash
# 特定のテストファイルを実行
npx jest feature/links/infrastructure/api/__tests__/linkApi.test.ts

# リンク機能のすべてのテストを実行
npx jest feature/links

# カバレッジレポートの生成
npx jest feature/links --coverage
```

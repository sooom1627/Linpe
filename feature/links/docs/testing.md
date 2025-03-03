# リンク機能のテスト

このドキュメントでは、リンク機能に関するテスト戦略と実装方法について説明します。

## テスト対象コンポーネント

リンク機能は以下のレイヤーで構成されています：

1. **インフラストラクチャ層**
   - `linkApi`: Supabaseとの通信を担当
   - `linkActionsApi`: リンクアクションの通信を担当
   - `utils`: ユーティリティ関数
2. **アプリケーション層**
   - `linkService`: ビジネスロジックを実装
   - `linkActionService`: リンクアクションのビジネスロジックを実装
   - `hooks`: React Hooksを使用したロジック
3. **プレゼンテーション層**
   - `SwipeScreen`: ユーザーインターフェース
   - `components`: 再利用可能なUIコンポーネント

## テスト実装状況

| コンポーネント     | テストファイル                                                                    | カバレッジ   |
| ------------------ | --------------------------------------------------------------------------------- | ------------ |
| linkApi            | `feature/links/infrastructure/api/__tests__/linkApi.test.ts`                      | 主要メソッド |
| linkActionsApi     | `feature/links/infrastructure/api/__tests__/linkActionsApi.test.ts`               | 主要メソッド |
| linkService        | `feature/links/application/service/__tests__/linkServices.test.ts`                | 主要メソッド |
| linkActionService  | `feature/links/application/service/__tests__/linkActionService.test.ts`           | 主要メソッド |
| utils              | `feature/links/infrastructure/utils/__tests__/scheduledDateUtils.test.ts`         | 主要関数     |
| hooks              | `feature/links/application/hooks/__tests__/useSwipeScreenLinks.test.ts`           | 基本機能     |
| components         | `feature/links/presentation/components/display/__tests__/SwipeInfoPanel.test.tsx` | 基本機能     |
| SwipeScreen        | 未実装                                                                            | -            |
| LinkActionView     | 未実装                                                                            | -            |

## テスト実装例

### linkApiのテスト

`linkApi`のテストでは、Supabaseクライアントをモック化して、APIリクエストとレスポンスをシミュレートします。最近のリファクタリングにより、モックの実装が簡素化されました。

```typescript
// モックレスポンスを設定
const __mockResponse = {
  data: null,
  error: null,
};

// Supabaseのモックを設定
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          or: () => ({
            order: () => ({
              limit: () => __mockResponse,
            }),
          }),
        }),
      }),
    }),
    __mockResponse,
  },
}));

describe("linkApi", () => {
  describe("fetchUserLinks", () => {
    it("正常にデータを取得できること", async () => {
      // モックデータの設定
      __mockResponse.data = [{ id: 1, title: "テストリンク" }];
      __mockResponse.error = null;

      // テスト実行
      const result = await linkApi.fetchUserLinks("user123");

      // アサーション
      expect(result).toEqual([{ id: 1, title: "テストリンク" }]);
    });

    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーのモック
      __mockResponse.data = null;
      __mockResponse.error = { message: "エラーが発生しました" };

      // テスト実行とアサーション
      await expect(linkApi.fetchUserLinks("user123")).rejects.toThrow(
        "エラーが発生しました",
      );
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
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
  });

  describe("fetchSwipeableLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksを呼び出すこと", async () => {
      // モックの設定
      (linkApi.fetchUserLinks as jest.Mock).mockResolvedValue([
        { id: 1, title: "リンク1" },
        { id: 2, title: "リンク2" },
      ]);

      // テスト実行
      const result = await linkService.fetchSwipeableLinks("user123");

      // アサーション
      expect(linkApi.fetchUserLinks).toHaveBeenCalledWith("user123", {
        includeReadyToRead: true,
      });
      expect(result).toHaveLength(2);
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーのモック
      (linkApi.fetchUserLinks as jest.Mock).mockRejectedValue(
        new Error("APIエラー"),
      );

      // テスト実行とアサーション
      await expect(linkService.fetchSwipeableLinks("user123")).rejects.toThrow(
        "APIエラー",
      );
    });
  });
});
```

## ルーティングテスト

アプリケーションのルーティングテストは、`app/__tests__`ディレクトリに実装されています。これらのテストは、認証状態に基づいたナビゲーションの動作を検証します。

詳細については、以下のドキュメントを参照してください：

- [アプリケーションテスト概要](/app/__tests__/README.md)
- [ルーティングテスト](/app/__tests__/routes/README.md)
- [テストヘルパー](/app/__tests__/helpers/README.md)

## テストカバレッジの向上

今後、以下のテストを追加することで、テストカバレッジを向上させる予定です：

1. **SwipeScreenのテスト**

   - ユーザーインタラクションのテスト
   - データ取得と表示のテスト
   - スワイプジェスチャーのテスト

2. **エラーハンドリングのテスト**

   - ネットワークエラーの処理
   - バリデーションエラーの処理
   - 境界値のテスト

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

## テスト作成のベストプラクティス

1. **モックの共通化**

   - 共通のモックは専用のモックファイルに定義し、テスト間で再利用する
   - 複雑なモックは関数として抽象化し、テストコードを簡潔に保つ

2. **テストの構造化**

   - 各テストは「準備（Arrange）」「実行（Act）」「検証（Assert）」の3ステップで構造化する
   - `beforeEach` と `afterEach` を使用して、テスト間の状態をリセットする

3. **非同期処理のテスト**

   - `act` と `jest.runAllTimers()`
     を組み合わせて、タイマーベースの非同期処理をテストする
   - `waitFor` を使用して、非同期の状態変化を待機する

4. **日本語のテスト記述**
   - テストの説明は日本語で記述し、テストの目的を明確に伝える
   - テスト名は「〜すること」の形式で、期待される動作を表現する

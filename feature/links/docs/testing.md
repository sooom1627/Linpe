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
   - `notificationService`: 通知表示を担当
   - `hooks`: React Hooksを使用したロジック
3. **プレゼンテーション層**
   - `SwipeScreen`: ユーザーインターフェース
   - `LinkActionView`: リンクアクションのUI
   - `components`: 再利用可能なUIコンポーネント

## テスト実装状況

| コンポーネント      | テストファイル                                                                    | カバレッジ   |
| ------------------- | --------------------------------------------------------------------------------- | ------------ |
| linkApi             | `feature/links/infrastructure/api/__tests__/linkApi.test.ts`                      | 主要メソッド |
| linkActionsApi      | `feature/links/infrastructure/api/__tests__/linkActionsApi.test.ts`               | 主要メソッド |
| linkService         | `feature/links/application/service/__tests__/linkServices.test.ts`                | 主要メソッド |
| linkActionService   | `feature/links/application/service/__tests__/linkActionService.test.ts`           | 主要メソッド |
| notificationService | `feature/links/application/service/__tests__/notificationService.test.ts`         | 主要メソッド |
| utils               | `feature/links/infrastructure/utils/__tests__/scheduledDateUtils.test.ts`         | 主要関数     |
| useSwipeScreenLinks | `feature/links/application/hooks/__tests__/useSwipeScreenLinks.test.ts`           | 基本機能     |
| useLinkAction       | `feature/links/application/hooks/link/__tests__/useLinkAction.test.ts`            | 基本機能     |
| useLinkInput        | `feature/links/application/hooks/link/__tests__/useLinkInput.test.ts`             | 基本機能     |
| components          | `feature/links/presentation/components/display/__tests__/SwipeInfoPanel.test.tsx` | 基本機能     |
| LinkActionView      | `feature/links/presentation/views/__tests__/LinkActionView.test.tsx`              | 基本機能     |
| SwipeScreen         | 未実装                                                                            | -            |

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
      const result = await linkApi.fetchUserLinks({
        userId: "user123",
        limit: 10,
      });

      // アサーション
      expect(result).toEqual([{ id: 1, title: "テストリンク" }]);
    });

    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーのモック
      __mockResponse.data = null;
      __mockResponse.error = { message: "エラーが発生しました" };

      // テスト実行とアサーション
      await expect(
        linkApi.fetchUserLinks({
          userId: "user123",
          limit: 10,
        }),
      ).rejects.toThrow("エラーが発生しました");
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
      expect(linkApi.fetchUserLinks).toHaveBeenCalledWith({
        userId: "user123",
        limit: 20,
        includeReadyToRead: true,
        orderBy: "link_updated_at",
        ascending: true,
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

### useLinkActionのテスト

`useLinkAction`フックのテストでは、サービス層をモック化して、フックの動作を検証します。

```typescript
// モックの設定
const mockLinkActionService = {
  deleteLinkAction: jest.fn(),
  updateCacheAfterDelete: jest.fn(),
};

const mockNotificationService = {
  success: jest.fn(),
  error: jest.fn(),
};

jest.mock("@/feature/links/application/service/linkActionService", () => ({
  linkActionService: mockLinkActionService,
}));

jest.mock("@/feature/common/application/service/notificationService", () => ({
  notificationService: mockNotificationService,
}));

describe("useLinkAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deleteLinkActionが成功した場合、キャッシュを更新し成功通知を表示すること", async () => {
    // 成功レスポンスのモック
    mockLinkActionService.deleteLinkAction.mockResolvedValue({
      success: true,
      error: null,
    });

    // フックの使用
    const { result } = renderHook(() => useLinkAction());

    // 削除アクションの実行
    await act(async () => {
      await result.current.deleteLinkAction("test-user", "test-link");
    });

    // 検証
    expect(mockLinkActionService.deleteLinkAction).toHaveBeenCalledWith(
      "test-user",
      "test-link",
    );
    expect(mockLinkActionService.updateCacheAfterDelete).toHaveBeenCalled();
    expect(mockNotificationService.success).toHaveBeenCalledWith(
      "リンクが削除されました",
      undefined,
      expect.any(Object),
    );
  });

  it("deleteLinkActionが失敗した場合、エラー通知を表示すること", async () => {
    // 失敗レスポンスのモック
    const testError = new Error("削除エラー");
    mockLinkActionService.deleteLinkAction.mockResolvedValue({
      success: false,
      error: testError,
    });

    // フックの使用
    const { result } = renderHook(() => useLinkAction());

    // 削除アクションの実行
    await act(async () => {
      await result.current.deleteLinkAction("test-user", "test-link");
    });

    // 検証
    expect(mockLinkActionService.deleteLinkAction).toHaveBeenCalledWith(
      "test-user",
      "test-link",
    );
    expect(mockLinkActionService.updateCacheAfterDelete).not.toHaveBeenCalled();
    expect(mockNotificationService.error).toHaveBeenCalledWith(
      "リンクの削除に失敗しました",
      "削除エラー",
      expect.any(Object),
    );
  });
});
```

### LinkActionViewのテスト

`LinkActionView`コンポーネントのテストでは、フックをモック化して、UIの動作を検証します。

```typescript
// useLinkActionのモック
jest.mock("@/feature/links/application/hooks/link", () => ({
  useLinkAction: jest.fn(),
}));

// useLocalSearchParamsのモック
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    linkId: "test-link-id",
    userId: "test-user-id",
    title: "テストリンク",
    domain: "example.com",
    full_url: "https://example.com",
  })),
}));

describe("LinkActionView", () => {
  const mockOnClose = jest.fn();
  const mockDeleteLinkAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // useLinkActionのモック実装
    (useLinkAction as jest.Mock).mockReturnValue({
      deleteLinkAction: mockDeleteLinkAction,
      isLoading: false,
    });
  });

  it("リンク削除が成功した場合、onCloseが呼ばれること", async () => {
    // 削除成功のモック
    mockDeleteLinkAction.mockResolvedValue({ success: true });

    // コンポーネントをレンダリング
    const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

    // 削除ボタンをクリック
    fireEvent.press(getByText("Delete Link"));

    // 非同期処理の完了を待つ
    await waitFor(() => {
      // deleteLinkActionが正しいパラメータで呼ばれたことを確認
      expect(mockDeleteLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
      );

      // onCloseが呼ばれたことを確認
      expect(mockOnClose).toHaveBeenCalled();
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

2. **LinkActionViewのテスト拡充**

   - マーク機能のテスト
   - エラー状態のテスト
   - ローディング状態のテスト

3. **通知サービスの統合テスト**

   - 各種通知タイプのテスト
   - 通知オプションのテスト
   - 通知の表示と非表示のテスト

4. **キャッシュ更新戦略のテスト**

   - 複数キャッシュの更新テスト
   - パターンマッチングによる更新テスト
   - 更新後のUI反映テスト

5. **エラーハンドリングのテスト**

   - ネットワークエラーの処理
   - バリデーションエラーの処理
   - 境界値のテスト

6. **エンドツーエンドテスト**
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

5. **通知サービスのテスト**

   - 通知の表示内容と表示オプションを検証する
   - 通知サービスの呼び出しパターンを検証する

6. **キャッシュ更新のテスト**
   - mutate関数の呼び出しパターンを検証する
   - キャッシュキーの正確性を検証する

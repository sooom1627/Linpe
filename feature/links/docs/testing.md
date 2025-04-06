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
| linkFilterService   | `feature/links/application/service/__tests__/linkFilterService.test.ts`           | 全機能       |
| notificationService | `feature/links/application/service/__tests__/notificationService.test.ts`         | 主要メソッド |
| linkCacheKeys       | `feature/links/application/cache/__tests__/linkCacheKeys.test.ts`                 | 全機能       |
| linkCacheService    | `feature/links/application/cache/__tests__/linkCacheService.test.ts`              | 全機能       |
| utils               | `feature/links/infrastructure/utils/__tests__/scheduledDateUtils.test.ts`         | 主要関数     |
| useSwipeScreenLinks | `feature/links/application/hooks/__tests__/useSwipeScreenLinks.test.ts`           | 基本機能     |
| useLinkAction       | `feature/links/application/hooks/link/__tests__/useLinkAction.test.ts`            | 基本機能     |
| useLinkInput        | `feature/links/application/hooks/link/__tests__/useLinkInput.test.ts`             | 基本機能     |
| useLinksFiltering   | `feature/links/application/hooks/link/__tests__/useLinksFiltering.test.tsx`       | 全機能       |
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

// チェーンメソッドを持つモックオブジェクト
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockImplementation(() => __mockResponse),
  rpc: jest.fn(),
};

// テスト内からモックレスポンスを変更できるようにする
return {
  ...mockSupabase,
  __mockResponse,
};
```

#### 共通のクエリ実行パターンのテスト

`executeQuery`関数の導入により、クエリ実行パターンが統一されました。これをテストするために、以下のようなテストケースを追加しています：

```typescript
describe("共通のクエリ実行パターン", () => {
  it("すべてのメソッドで同じクエリ実行パターンが使用されていること", async () => {
    // モックデータ
    const mockData = [createMockLink()];
    supabase.__mockResponse.data = mockData;

    // 各メソッドを実行
    await linkApi.fetchUserLinks({
      userId: "test-user",
      limit: 10,
      orderBy: "added_at",
      ascending: true,
    });

    await linkApi.fetchUserLinksByStatus({
      userId: "test-user",
      status: "Today",
      limit: 10,
      orderBy: "added_at",
      ascending: true,
    });

    await linkApi.fetchUserLinksWithCustomQuery({
      userId: "test-user",
      limit: 10,
      queryBuilder: (query) => query,
      orderBy: "added_at",
      ascending: true,
    });

    // 各メソッドで同じパターンのクエリが実行されていることを確認
    expect(supabase.order).toHaveBeenCalledTimes(3);
    expect(supabase.limit).toHaveBeenCalledTimes(3);

    // すべての呼び出しで同じパラメータが使用されていることを確認
    for (let i = 0; i < 3; i++) {
      expect(supabase.order.mock.calls[i][0]).toBe("added_at");
      expect(supabase.order.mock.calls[i][1]).toEqual({ ascending: true });
      expect(supabase.limit.mock.calls[i][0]).toBe(10);
    }
  });

  it("エラーハンドリングが一貫していること", async () => {
    // エラーをモック
    const mockError = new Error("Database error");
    supabase.__mockResponse.data = null;
    supabase.__mockResponse.error = mockError;

    // 各メソッドでエラーがスローされることを確認
    await expect(
      linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
      }),
    ).rejects.toThrow("Database error");

    await expect(
      linkApi.fetchUserLinksByStatus({
        userId: "test-user",
        status: "Today",
        limit: 10,
      }),
    ).rejects.toThrow("Database error");

    await expect(
      linkApi.fetchUserLinksWithCustomQuery({
        userId: "test-user",
        limit: 10,
        queryBuilder: (query) => query,
      }),
    ).rejects.toThrow("Database error");
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
        new Error("エラーが発生しました"),
      );

      // テスト実行とアサーション
      await expect(linkService.fetchSwipeableLinks("user123")).rejects.toThrow(
        "エラーが発生しました",
      );
    });
  });
});
```

### linkActionServiceのテスト

`linkActionService`のテストでは、`linkActionsApi`をモック化して、サービスの動作を検証します。

```typescript
// linkActionsApiのモック
jest.mock("@/feature/links/infrastructure/api", () => ({
  linkActionsApi: {
    updateLinkAction: jest.fn(),
    deleteLinkAction: jest.fn(),
  },
}));

describe("linkActionService", () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
  });

  describe("updateLinkActionBySwipe", () => {
    it("正しいパラメータでlinkActionsApi.updateLinkActionを呼び出すこと", async () => {
      // モックの設定
      (linkActionsApi.updateLinkAction as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: "1", status: "Today" },
      });

      // テスト実行
      const result = await linkActionService.updateLinkActionBySwipe(
        "user123",
        "link456",
        "Today",
        0,
      );

      // アサーション
      expect(linkActionsApi.updateLinkAction).toHaveBeenCalledWith({
        userId: "user123",
        linkId: "link456",
        status: "Today",
        swipeCount: 0,
        scheduled_read_at: expect.any(String),
      });
      expect(result.success).toBe(true);
    });
  });
});
```

### useLinkActionのテスト

`useLinkAction`フックのテストでは、`linkActionService`と`notificationService`をモック化して、フックの動作を検証します。

```typescript
// モックの設定
jest.mock("@/feature/links/application/service/linkActionService", () => ({
  linkActionService: {
    updateLinkActionBySwipe: jest.fn(),
    updateLinkActionByReadStatus: jest.fn(),
    deleteLinkAction: jest.fn(),
  },
}));

jest.mock("@/lib/notification", () => ({
  notificationService: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useLinkAction", () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
  });

  describe("updateLinkActionBySwipe", () => {
    it("正しいパラメータでlinkActionService.updateLinkActionBySwipeを呼び出すこと", async () => {
      // モックの設定
      (
        linkActionService.updateLinkActionBySwipe as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkActionBySwipe(
          "test-user-id",
          "test-link-id",
          "Today",
          0,
        );
      });

      // アサーション
      expect(linkActionService.updateLinkActionBySwipe).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Today",
        0,
      );
    });
  });
});
```

### LinkActionViewのテスト

`LinkActionView`コンポーネントのテストでは、`useLinkAction`フックをモック化して、UIの動作を検証します。

```typescript
// モックの設定
const mockDeleteLinkAction = jest.fn();
const mockUpdateLinkActionByReadStatus = jest.fn();
const mockIsLoading = false;

jest.mock("@/feature/links/application/hooks", () => ({
  useLinkAction: () => ({
    deleteLinkAction: mockDeleteLinkAction,
    updateLinkActionByReadStatus: mockUpdateLinkActionByReadStatus,
    isLoading: mockIsLoading,
  }),
}));

describe("LinkActionView", () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    mockDeleteLinkAction.mockResolvedValue({ success: true });
    mockUpdateLinkActionByReadStatus.mockResolvedValue({ success: true });
  });

  it("削除ボタンをクリックすると、deleteLinkActionが呼ばれること", async () => {
    // コンポーネントをレンダリング
    const mockOnClose = jest.fn();
    const { getByTestId } = render(
      <LinkActionView
        params={{
          userId: "test-user-id",
          linkId: "test-link-id",
        }}
        onClose={mockOnClose}
      />,
    );

    // 削除ボタンをクリック
    fireEvent.press(getByTestId("delete-button"));

    // deleteLinkActionが呼ばれたことを確認
    await waitFor(() => {
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

### useLinkInputのテスト

`useLinkInput`フックのテストでは、`linkService`と`notificationService`をモック化して、リンク追加の成功と失敗のシナリオをテストします。

```typescript
// モックの設定
mockLinkService.addLinkAndUser.mockResolvedValue({
  status: "registered",
  link: { id: "test-link-id" },
});

// handleAddLinkの実装をモック
mockHandleAddLink.mockImplementation(async () => {
  const data = await mockLinkService.addLinkAndUser(
    "https://example.com",
    "test-user-id",
  );
  await mutate((key) => typeof key === "string" && key.startsWith("links-"));

  if (data.status === "registered") {
    mockNotificationService.success("Success", undefined, {});
  } else {
    mockNotificationService.info("Already registered", undefined, {});
  }
});

// リンク追加を実行
await mockHandleAddLink();

// 検証
expect(mockLinkService.addLinkAndUser).toHaveBeenCalledWith(
  "https://example.com",
  "test-user-id",
);
expect(mutate).toHaveBeenCalled();
expect(mockNotificationService.success).toHaveBeenCalledWith(
  "Success",
  undefined,
  {},
);
```

### linkFilterServiceのテスト

リンクのフィルタリングロジックを扱う`linkFilterService`のテストでは、様々なフィルタリング条件での動作を検証します。

```typescript
describe("filterByTab", () => {
  it("allタブではすべてのリンクを返すこと", () => {
    const result = linkFilterService.filterByTab(mockLinks, "all");
    expect(result).toHaveLength(mockLinks.length);
    expect(result).toEqual(mockLinks);
  });

  it("toReadタブではread_atがnullまたはステータスがRe-Readのリンクを返すこと", () => {
    const result = linkFilterService.filterByTab(mockLinks, "toRead");

    // 結果の検証
    expect(
      result.every(
        (link) => link.read_at === null || link.status === "Re-Read",
      ),
    ).toBe(true);
  });

  it("readタブではread_atが値を持つリンクを返すこと", () => {
    const result = linkFilterService.filterByTab(mockLinks, "read");

    // 結果の検証
    expect(result.every((link) => link.read_at !== null)).toBe(true);
  });
});

describe("filterByStatus", () => {
  it("statusがnullの場合、すべてのリンクを返すこと", () => {
    const result = linkFilterService.filterByStatus(mockLinks, null);
    expect(result).toEqual(mockLinks);
  });

  it("指定したステータスに一致するリンクのみを返すこと", () => {
    const result = linkFilterService.filterByStatus(mockLinks, "Today");

    // 結果の検証
    expect(result.every((link) => link.status === "Today")).toBe(true);
  });
});
```

### useLinksFilteringのテスト

`useLinksFiltering`フックのテストでは、メモ化の効果とサービス呼び出しの正確性をテストします。

```typescript
// モックの設定
jest.mock("@/feature/links/application/service/linkFilterService", () => ({
  linkFilterService: {
    filterLinks: jest.fn(),
    getAvailableStatuses: jest.fn(),
  },
}));

describe("useLinksFiltering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (linkFilterService.filterLinks as jest.Mock).mockReturnValue(
      mockFilteredLinks,
    );
    (linkFilterService.getAvailableStatuses as jest.Mock).mockReturnValue(
      mockAvailableStatuses,
    );
  });

  it("サービスを正しいパラメータで呼び出すこと", () => {
    renderHook(() => useLinksFiltering(mockLinks, "toRead", "Today"));

    expect(linkFilterService.filterLinks).toHaveBeenCalledWith(
      mockLinks,
      "toRead",
      "Today",
    );
  });

  it("パラメータが変更されたときにのみサービスを再呼び出しすること", () => {
    // 初回レンダリング
    const { rerender } = renderHook(
      ({ links, tab, status }) => useLinksFiltering(links, tab, status),
      {
        initialProps: {
          links: mockLinks,
          tab: "toRead",
          status: "Today",
        },
      },
    );

    // サービスの呼び出しをリセット
    jest.clearAllMocks();

    // 同じパラメータで再レンダリング
    rerender({
      links: mockLinks,
      tab: "toRead",
      status: "Today",
    });

    // メモ化により呼び出されないことを確認
    expect(linkFilterService.filterLinks).not.toHaveBeenCalled();
  });
});
```

## テスト戦略

リンク機能のテストでは、以下の戦略を採用しています：

1. **単体テスト**:

   - 各レイヤーのコンポーネントを個別にテスト
   - 依存関係をモック化して分離
   - 入力と出力の検証

2. **統合テスト**:

   - 複数のコンポーネントの連携をテスト
   - 実際のデータフローの検証

3. **UI テスト**:
   - ユーザーインターフェースの動作をテスト
   - ユーザーアクションのシミュレーション

## モック戦略

テストでは、以下のモック戦略を採用しています：

1. **外部依存のモック**:

   - Supabaseクライアント
   - 通知サービス
   - SWRのmutate関数

2. **内部依存のモック**:
   - サービス層のモック
   - フックのモック
   - コンテキストのモック

## テストカバレッジの向上

テストカバレッジを向上させるために、以下の取り組みを行っています：

1. **エッジケースのテスト**:

   - エラーケース
   - 空のデータケース
   - 境界値ケース

2. **非同期処理のテスト**:

   - 非同期関数の成功と失敗
   - ローディング状態の検証

3. **ユーザーインタラクションのテスト**:
   - ボタンクリック
   - フォーム入力
   - スワイプ操作

## 今後の改善点

1. **テストカバレッジの拡大**:

   - SwipeScreenのテスト実装
   - より多くのエッジケースのテスト

2. **E2Eテストの導入**:

   - 実際のユーザーフローをシミュレート
   - 複数の画面にまたがるテスト

3. **パフォーマンステスト**:

   - レンダリングパフォーマンスの測定
   - データ取得パフォーマンスの測定

4. **アクセシビリティテスト**:
   - スクリーンリーダー対応のテスト
   - キーボードナビゲーションのテスト

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

## 循環参照問題への対応

テストファイルを作成する際、循環参照の問題に遭遇することがあります。特にフックのテストでは、他のフックやサービスをモック化する際に注意が必要です。

### 問題例

```typescript
// ❌ 循環参照を引き起こす可能性がある
jest.mock("@/feature/links/application/hooks", () => ({
  useLinkAction: jest.fn(),
}));
```

### 解決策

相対パスを使用して、具体的なモジュールをモック化します：

```typescript
// ✅ 循環参照を避ける
jest.mock("../../link/useLinkAction", () => ({
  useLinkAction: jest.fn(),
}));
```

サービスやフックをモック化する際は、絶対パスよりも相対パスを優先して使用し、循環参照の問題を回避しましょう。

## 読書状態変更のテスト

### Link Actionサービスのテスト

Link Actionサービスに対しては、以下の主要なテストケースを実装しています：

1. **スワイプ操作の正確性**

   - スワイプ方向ごとに正しいステータスが設定されることを検証
   - スワイプ後のメタデータが正しく設定されることを検証

2. **読書状態変更の正確性**

   - 各読書状態（`Read`, `Bookmark`）への変更が正しく機能することを検証
   - 読書状態変更時のメタデータ更新（`read_at`, `read_count`など）を検証
   - **Re-Read処理の特殊ケース**:
     `Re-Read`ステータスが内部的に`Read`ステータスと`re_read=true`フラグの組み合わせとして適切に処理されることを検証

3. **エラーハンドリング**
   - API呼び出しが失敗した場合の挙動を検証
   - 例外発生時のエラー処理を検証

### Link Action Hookのテスト

useLinkActionフックに対しては、以下のテストケースを実装しています：

1. **サービス連携の検証**

   - サービスメソッドが正しいパラメータで呼び出されることを検証
   - **Re-Read処理の変換**:
     UIから`Re-Read`ステータスが渡された場合に、正しく`Read`ステータスと`re_read=true`に変換されることを検証

2. **キャッシュ更新の検証**

   - 操作成功時にキャッシュが更新されることを検証

3. **通知の検証**
   - 成功/失敗時に適切な通知が表示されることを検証

### 統合テスト

読書状態変更に関する統合テストでは、以下の点を検証します：

1. **エンドツーエンドの動作**

   - UIからの操作が正しくデータベースに反映されることを検証
   - データベース反映後のUI更新が正しく行われることを検証

2. **複雑なユースケース**
   - メタデータの累積的な更新（`read_count`の増加など）を検証

# ダッシュボード機能のテスト

このドキュメントでは、ダッシュボード機能に関するテスト戦略と実装方法について説明します。

## テスト対象コンポーネント

ダッシュボード機能は以下のレイヤーで構成されています：

1. **インフラストラクチャ層**
   - `actionLogCountApi`: Supabaseとの通信を担当
   - `ActionLogCountRepository`: リポジトリの実装
2. **アプリケーション層**
   - `actionLogCountService`: ビジネスロジックを実装
   - `useActionLogCount`: React Hooksを使用したロジック
   - `actionLogCacheKeys`: キャッシュキーの定義
   - `actionLogCacheService`: キャッシュ更新ロジック
3. **ドメイン層**
   - `ActionLogCount`: ドメインモデル
   - `ActionType`: アクションタイプの定義
   - `ActionStatus`: アクションステータスの定義
4. **プレゼンテーション層**
   - `TopView`: ユーザーインターフェース
   - `StatCard`: 統計情報表示コンポーネント

## テスト実装状況

| コンポーネント        | テストファイル                                                                   | カバレッジ   |
| --------------------- | -------------------------------------------------------------------------------- | ------------ |
| actionLogCountApi     | `feature/dashboard/infrastructure/api/__tests__/actionLogCountApi.test.ts`       | 主要メソッド |
| actionLogCountService | `feature/dashboard/application/services/__tests__/actionLogCountService.test.ts` | 主要メソッド |
| useActionLogCount     | `feature/dashboard/application/hooks/__tests__/useActionLogCount.test.ts`        | 主要メソッド |
| actionLogCacheKeys    | `feature/dashboard/application/cache/__tests__/actionLogCacheKeys.test.ts`       | 全機能       |
| actionLogCacheService | `feature/dashboard/application/cache/__tests__/actionLogCacheService.test.ts`    | 全機能       |
| ActionLogCount        | `feature/dashboard/domain/models/__tests__/ActionLogCount.test.ts`               | 全機能       |
| TopView               | 未実装                                                                           | -            |
| StatCard              | 未実装                                                                           | -            |

## テスト実装例

### actionLogCountApi.test.ts

`actionLogCountApi`のテストでは、Supabaseクライアントをモック化して、APIリクエストとレスポンスをシミュレートします。

```typescript
// モックレスポンスの型定義
interface MockResponse {
  data: unknown | null;
  count: number | null;
  error: Error | null;
}

// モックSupabaseの型定義
interface MockSupabase {
  from: jest.Mock;
  select: jest.Mock;
  eq: jest.Mock;
  in: jest.Mock;
  gte: jest.Mock;
  lte: jest.Mock;
  limit: jest.Mock;
  then: (resolve: (value: MockResponse) => unknown) => Promise<unknown>;
  __mockResponse: MockResponse;
}

// Supabaseのモック
jest.mock("@/lib/supabase", () => {
  // モックレスポンスを設定
  const __mockResponse: MockResponse = {
    data: null,
    count: null,
    error: null,
  };

  // チェーンメソッドを持つモックオブジェクト
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    // thenメソッドを実装してawaitで__mockResponseを返す
    then: (resolve: (value: typeof __mockResponse) => unknown) =>
      Promise.resolve(resolve(__mockResponse)),
    __mockResponse,
  };

  return mockSupabase;
});

describe("fetchActionLogCountByType", () => {
  it("正しいパラメータでクエリを実行すること", async () => {
    // テスト実行
    const result = await actionLogCountApi.fetchActionLogCountByType({
      userId: "test-user",
      actionType: ActionType.ADD,
      startDate: "2023-01-01",
      endDate: "2023-01-31",
    });

    // アサーション
    expect(supabase.from).toHaveBeenCalledWith("user_link_actions_log");
    expect(supabase.select).toHaveBeenCalledWith("*", {
      count: "exact",
      head: true,
    });
    expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
    expect(supabase.in).toHaveBeenCalled(); // ステータスの配列でinが呼ばれること
    expect(supabase.gte).toHaveBeenCalledWith(
      "changed_at",
      "2023-01-01T00:00:00",
    );
    expect(supabase.lte).toHaveBeenCalledWith(
      "changed_at",
      "2023-01-31T23:59:59",
    );
    expect(result).toBe(5);
  });
});
```

### actionLogCountService.test.ts

`actionLogCountService`のテストでは、`actionLogCountRepository`をモック化して、サービスの動作を検証します。

```typescript
// リポジトリのモック
const mockRepository: jest.Mocked<IActionLogCountRepository> = {
  getActionLogCount: jest.fn(),
};

describe("ActionLogCountService", () => {
  let service: ActionLogCountService;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    // サービスのインスタンスを作成
    service = new ActionLogCountService(mockRepository);
  });

  describe("getTodayActionLogCount", () => {
    it("正しいパラメータでリポジトリを呼び出すこと", async () => {
      // モックの設定
      mockRepository.getActionLogCount.mockResolvedValueOnce(10); // ADD
      mockRepository.getActionLogCount.mockResolvedValueOnce(20); // SWIPE
      mockRepository.getActionLogCount.mockResolvedValueOnce(30); // READ

      // 日付をモック
      const originalDate = global.Date;
      const mockDate = new Date("2023-01-15");
      global.Date = jest.fn(() => mockDate) as unknown as DateConstructor;

      // テスト実行
      const result = await service.getTodayActionLogCount("test-user");

      // アサーション
      expect(mockRepository.getActionLogCount).toHaveBeenCalledTimes(3);

      // ADD呼び出しの検証
      expect(mockRepository.getActionLogCount).toHaveBeenNthCalledWith(1, {
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-15",
        endDate: "2023-01-15",
      });

      // 結果の検証
      expect(result).toEqual({
        add: 10,
        swipe: 20,
        read: 30,
      });

      // モックをリストア
      global.Date = originalDate;
    });
  });
});
```

### useActionLogCount.test.ts

`useActionLogCount`フックのテストでは、SWRをモック化して、フックの動作を検証します。

```typescript
// SWRのモック
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// ActionLogCountServiceのモック
jest.mock("../../services/actionLogCountService", () => ({
  ActionLogCountService: jest.fn(),
}));

// ActionLogCountRepositoryのモック
jest.mock("../../../infrastructure/api/actionLogCountApi", () => ({
  ActionLogCountRepository: jest.fn(),
}));

describe("useActionLogCount", () => {
  const mockData = { add: 10, swipe: 20, read: 30 };
  const mockError = new Error("Test error");
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // SWRのモック実装
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });

    // サービスのモック実装
    (ActionLogCountService as jest.Mock).mockImplementation(() => ({
      getTodayActionLogCount: jest.fn().mockResolvedValue(mockData),
    }));

    // リポジトリのモック実装
    (ActionLogCountRepository as jest.Mock).mockImplementation(() => ({
      getActionLogCount: jest.fn().mockResolvedValue(10),
    }));
  });

  it("正しいキャッシュキーでSWRを呼び出すこと", () => {
    // フックを呼び出す
    useActionLogCount("test-user");

    // アサーション
    expect(useSWR).toHaveBeenCalledWith(
      ["today-action-log-count", "test-user"],
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 60000,
        errorRetryCount: 3,
      }),
    );
  });
});
```

### actionLogCacheKeys.test.ts

`actionLogCacheKeys`のテストでは、キャッシュキーの生成と判定関数をテストします。

```typescript
describe("ACTION_LOG_CACHE_KEYS", () => {
  it("TODAY_ACTION_LOG_COUNTが正しいキャッシュキーを返すこと", () => {
    const userId = "test-user";
    const result = ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId);
    expect(result).toEqual(["today-action-log-count", "test-user"]);
  });

  it("PERIOD_ACTION_LOG_COUNTが正しいキャッシュキーを返すこと", () => {
    const userId = "test-user";
    const startDate = "2023-01-01";
    const endDate = "2023-01-31";
    const result = ACTION_LOG_CACHE_KEYS.PERIOD_ACTION_LOG_COUNT(
      userId,
      startDate,
      endDate,
    );
    expect(result).toEqual([
      "period-action-log-count",
      "test-user",
      "2023-01-01",
      "2023-01-31",
    ]);
  });
});

describe("isActionLogCache", () => {
  it("アクションログ関連のキャッシュキーを正しく判定すること", () => {
    expect(isActionLogCache(["today-action-log-count", "test-user"])).toBe(
      true,
    );
    expect(isActionLogCache(["period-action-log-count", "test-user"])).toBe(
      true,
    );
    expect(isActionLogCache(["action-log-something", "test-user"])).toBe(true);
  });

  it("アクションログ関連でないキャッシュキーを正しく判定すること", () => {
    expect(isActionLogCache(["links", "test-user"])).toBe(false);
    expect(isActionLogCache("action-log")).toBe(false);
    expect(isActionLogCache(null)).toBe(false);
  });
});
```

### ActionLogCount.test.ts

`ActionLogCount`のテストでは、ドメインモデルとマッピングをテストします。

```typescript
describe("ActionStatus", () => {
  it("正しいステータス値を持つこと", () => {
    expect(ActionStatus.ADD).toBe("add");
    expect(ActionStatus.TODAY).toBe("Today");
    expect(ActionStatus.IN_WEEKEND).toBe("inWeekend");
    expect(ActionStatus.SKIP).toBe("Skip");
    expect(ActionStatus.READ).toBe("Read");
    expect(ActionStatus.RE_READ).toBe("Re-Read");
    expect(ActionStatus.BOOKMARK).toBe("Bookmark");
  });
});

describe("ActionType", () => {
  it("正しいタイプ値を持つこと", () => {
    expect(ActionType.ADD).toBe("add");
    expect(ActionType.SWIPE).toBe("swipe");
    expect(ActionType.READ).toBe("read");
  });
});

describe("statusToTypeMap", () => {
  it("ADDステータスが正しくマッピングされていること", () => {
    expect(statusToTypeMap[ActionStatus.ADD]).toBe(ActionType.ADD);
  });

  it("SWIPEステータスが正しくマッピングされていること", () => {
    expect(statusToTypeMap[ActionStatus.TODAY]).toBe(ActionType.SWIPE);
    expect(statusToTypeMap[ActionStatus.IN_WEEKEND]).toBe(ActionType.SWIPE);
    expect(statusToTypeMap[ActionStatus.SKIP]).toBe(ActionType.SWIPE);
  });
});
```

## テスト戦略

ダッシュボード機能のテストでは、以下の戦略を採用しています：

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
   - SWRのmutate関数

2. **内部依存のモック**:
   - サービス層のモック
   - リポジトリ層のモック
   - フックのモック

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

## 今後の改善点

1. **テストカバレッジの拡大**:

   - プレゼンテーション層のテスト実装
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
npx jest feature/dashboard/infrastructure/api/__tests__/actionLogCountApi.test.ts

# ダッシュボード機能のすべてのテストを実行
npx jest feature/dashboard

# カバレッジレポートの生成
npx jest feature/dashboard --coverage
```

## テスト作成のベストプラクティス

1. **モックの共通化**

   - 共通のモックは専用のモックファイルに定義し、テスト間で再利用する
   - 複雑なモックは関数として抽象化し、テストコードを簡潔に保つ

2. **テストの構造化**

   - 各テストは「準備（Arrange）」「実行（Act）」「検証（Assert）」の3ステップで構造化する
   - `beforeEach` と `afterEach` を使用して、テスト間の状態をリセットする

3. **非同期処理のテスト**

   - `async/await` を使用して、非同期処理をテストする
   - `jest.spyOn` を使用して、非同期関数の呼び出しを監視する

4. **日本語のテスト記述**

   - テストの説明は日本語で記述し、テストの目的を明確に伝える
   - テスト名は「〜すること」の形式で、期待される動作を表現する

5. **Supabaseモックのポイント**

   - チェーンメソッドを持つモックオブジェクトを作成する
   - `mockReturnThis()` を使用して、チェーンメソッドを実現する
   - `then` メソッドを実装して、Promiseとして動作させる

6. **SWRのテスト**
   - SWRをモック化して、データ取得とキャッシュ管理をテストする
   - キャッシュキーとフェッチャー関数の呼び出しを検証する
   - オプションの設定を検証する

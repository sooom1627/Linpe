# ダッシュボード機能のテスト

このドキュメントでは、ダッシュボード機能に関するテスト戦略と実装方法について説明します。

## テスト対象コンポーネント

ダッシュボード機能は以下のレイヤーで構成されています：

1. **インフラストラクチャ層**
   - `actionLogCountApi`: Supabaseとの通信を担当
   - `ActionLogCountRepository`: リポジトリの実装
   - `weeklyActivityRepository`: 週間アクティビティデータの取得
2. **アプリケーション層**
   - `actionLogCountService`: ビジネスロジックを実装
   - `useActionLogCount`: React Hooksを使用したロジック
   - `actionLogCacheKeys`: キャッシュキーの定義
   - `actionLogCacheService`: キャッシュ更新ロジック
   - `weeklyActivityService`: 週間アクティビティのビジネスロジック
   - `useWeeklyActivity`: 週間アクティビティのフック
3. **ドメイン層**
   - `ActionLogCount`: ドメインモデル
   - `ActionType`: アクションタイプの定義
   - `ActionStatus`: アクションステータスの定義
   - `WeeklyActivity`: 週間アクティビティのドメインモデル
4. **プレゼンテーション層**
   - `TopView`: ユーザーインターフェース
   - `StatCard`: 統計情報表示コンポーネント

## テスト実装状況

| コンポーネント           | テストファイル                                                                   | カバレッジ   |
| ------------------------ | -------------------------------------------------------------------------------- | ------------ |
| actionLogCountApi        | `feature/dashboard/infrastructure/api/__tests__/actionLogCountApi.test.ts`       | 主要メソッド |
| actionLogCountService    | `feature/dashboard/application/services/__tests__/actionLogCountService.test.ts` | 主要メソッド |
| useActionLogCount        | `feature/dashboard/application/hooks/__tests__/useActionLogCount.test.ts`        | 主要メソッド |
| actionLogCacheKeys       | `feature/dashboard/application/cache/__tests__/actionLogCacheKeys.test.ts`       | 全機能       |
| actionLogCacheService    | `feature/dashboard/application/cache/__tests__/actionLogCacheService.test.ts`    | 全機能       |
| ActionLogCount           | `feature/dashboard/domain/models/__tests__/ActionLogCount.test.ts`               | 全機能       |
| weeklyActivityRepository | `feature/dashboard/infrastructure/api/__tests__/weeklyActivityApi.test.ts`       | 全機能       |
| weeklyActivityService    | `feature/dashboard/application/services/__tests__/weeklyActivityService.test.ts` | 全機能       |
| useWeeklyActivity        | `feature/dashboard/application/hooks/__tests__/useWeeklyActivity.test.ts`        | 全機能       |
| TopView                  | 未実装                                                                           | -            |
| StatCard                 | 未実装                                                                           | -            |

## テスト実装例

### actionLogCountApi.test.ts

`actionLogCountRepository`のテストでは、Supabaseクライアントをモック化して、APIリクエストとレスポンスをシミュレートします。

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

describe("actionLogCountRepository", () => {
  it("正しいパラメータでクエリを実行すること", async () => {
    // テスト実行
    const result = await actionLogCountRepository.getActionLogCount({
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
    expect(supabase.gte).toHaveBeenCalledWith("changed_at", "2023-01-01");
    expect(supabase.lte).toHaveBeenCalledWith("changed_at", "2023-01-31");
    expect(result).toBe(5);
  });
});
```

### actionLogCountService.test.ts

`actionLogCountService`のテストでは、`actionLogCountRepository`をモック化して、サービスの動作を検証します。

```typescript
// リポジトリのモック
jest.mock("../../../infrastructure/api/actionLogCountApi", () => ({
  actionLogCountRepository: {
    getActionLogCount: jest.fn(),
  },
}));

// dateUtilsのモック
jest.mock("@/lib/utils/dateUtils", () => ({
  dateUtils: {
    getLocalDate: jest.fn().mockImplementation(() => new Date("2023-01-15")),
    getDateRangeForFetch: jest.fn().mockImplementation(() => ({
      startUTC: "2023-01-15T00:00:00.000Z",
      endUTC: "2023-01-15T23:59:59.999Z",
      timezone: "mock",
    })),
    getUserTimezone: jest.fn().mockReturnValue("mock"),
  },
}));

// モックされたリポジトリをインポート
const { actionLogCountRepository } = jest.requireMock(
  "../../../infrastructure/api/actionLogCountApi",
);

describe("actionLogCountService", () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
  });

  describe("getTodayActionLogCount", () => {
    it("正しいパラメータでリポジトリを呼び出すこと", async () => {
      // モックの設定
      actionLogCountRepository.getActionLogCount
        .mockResolvedValueOnce(10) // ADD
        .mockResolvedValueOnce(20) // SWIPE
        .mockResolvedValueOnce(30); // READ

      // テスト実行
      const result =
        await actionLogCountService.getTodayActionLogCount("test-user");

      // アサーション
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledTimes(
        3,
      );

      // 並列処理では呼び出し順序が保証されないため、各呼び出しが行われたことを検証
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-15T00:00:00.000Z",
        endDate: "2023-01-15T23:59:59.999Z",
      });

      // 結果の検証
      expect(result).toEqual({
        add: 10,
        swipe: 20,
        read: 30,
      });
    });
  });
});
```

### useActionLogCount.test.ts

`useActionLogCount`フックのテストでは、SWRとサービスをモック化して、フックの動作を検証します。

```typescript
// SWRのモック
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// actionLogCountServiceのモック
jest.mock("../../services/actionLogCountService", () => ({
  actionLogCountService: {
    getTodayActionLogCount: jest.fn().mockResolvedValue({
      add: 10,
      swipe: 20,
      read: 30,
    }),
  },
}));

// キャッシュキーのモック
jest.mock("../../cache/actionLogCacheKeys", () => ({
  ACTION_LOG_CACHE_KEYS: {
    TODAY_ACTION_LOG_COUNT: (userId: string) =>
      userId ? ["today-action-log-count", userId] : null,
    PERIOD_ACTION_LOG_COUNT: (
      userId: string,
      startDate: string,
      endDate: string,
    ) =>
      userId ? ["period-action-log-count", userId, startDate, endDate] : null,
  },
}));

// SWR設定のモック
jest.mock("../../cache/swrConfig", () => ({
  SWR_DEFAULT_CONFIG: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    errorRetryCount: 3,
  },
}));

describe("useActionLogCount", () => {
  it("正しいキャッシュキーでSWRを呼び出すこと", () => {
    // フックを呼び出す
    useActionLogCount("test-user");

    // アサーション
    expect(useSWR).toHaveBeenCalledWith(
      ["today-action-log-count", "test-user"],
      expect.any(Function),
      SWR_DEFAULT_CONFIG,
    );
  });
});
```

### DataFetchState.test.tsx

新しく追加した`DataFetchState`コンポーネントのテストでは、ローディングとエラー状態、および通常の表示をテストします。

```typescript
describe("DataFetchState", () => {
  it("正常系: ローディング中の場合、ローディングメッセージを表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={true} error={null}>
        <Text>Content</Text>
      </DataFetchState>
    );

    expect(getByText("読み込み中...")).toBeTruthy();
    expect(() => getByText("Content")).toThrow();
  });

  it("正常系: エラーがある場合、エラーメッセージを表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={false} error={new Error("Test error")}>
        <Text>Content</Text>
      </DataFetchState>
    );

    expect(getByText("データの取得に失敗しました")).toBeTruthy();
    expect(() => getByText("Content")).toThrow();
  });

  it("正常系: ローディングでもエラーでもない場合、子要素を表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={false} error={null}>
        <Text>Content</Text>
      </DataFetchState>
    );

    expect(getByText("Content")).toBeTruthy();
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
   - SWRの関数

2. **内部依存のモック**:
   - サービス層のモック
   - リポジトリ層のモック
   - フックのモック
   - ユーティリティ関数のモック

## 関数ベースアーキテクチャのテスト利点

関数ベースアーキテクチャへの移行により、テストに以下の利点があります：

1. **シンプルなモック**

   - 関数や単純なオブジェクトのモックは容易
   - インスタンス化の必要がない
   - 継承ツリーの複雑性がない

2. **依存性の明示的な注入**

   - 依存関係を直接モックできる
   - 関数呼び出しの検証が容易
   - テストのセットアップが単純化

3. **純粋関数のテスト**

   - 入力と出力の関係のみをテスト
   - 副作用のないテスト
   - より予測可能なテスト

4. **テストコードの簡潔さ**
   - 少ないボイラープレートコード
   - より読みやすいテスト
   - メンテナンスが容易

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

## クラスベースから関数ベースへの移行

最近のリファクタリングでは、クラスベースの実装から関数ベースの実装に移行しました。この変更には以下のような利点があります：

1. **宣言的なアプローチ**

   - より予測可能な動作
   - テストの容易性向上
   - 副作用の制御が容易

2. **依存性の明示的な注入**

   - 関数の引数として依存関係を渡す
   - テストでのモック化が容易
   - コードの意図がより明確

3. **テストの簡素化**

   - インスタンス化が不要
   - 状態管理が単純化
   - モックの設定がより直感的

4. **保守性の向上**
   - コードの見通しが良好
   - 変更の影響範囲が明確
   - 再利用性の向上

この移行により、テストコードもより簡潔で理解しやすいものになりました。

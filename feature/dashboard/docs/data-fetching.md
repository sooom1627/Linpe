# ダッシュボード データ取得フロー

## 概要

ダッシュボード機能では、ユーザーのアクションログカウントを取得して表示します。このドキュメントでは、ダッシュボード機能でのデータ取得フローについて説明します。

## データフロー

```
TopView (Presentation)
    ↓
useActionLogCount (Application Hook)
    ↓
actionLogCountService.getTodayActionLogCount (Application Service)
    ↓
actionLogCountRepository.getActionLogCount (Repository)
    ↓
actionLogCountApi.fetchActionLogCountByType (Infrastructure API)
    ↓
Supabase (Database)
```

## 各レイヤーの役割

### 1. プレゼンテーション層 (TopView.tsx)

- ユーザーインターフェースの表示
- データの取得状態に応じた表示の切り替え（ローディング、エラー、データあり）
- 取得したデータを使用して統計情報の表示

```tsx
const { session } = useSession();
const userId = session?.user?.id || "";
const { data: actionLogCount, isLoading, error } = useActionLogCount(userId);

// アクションログカウントのデータを準備
const stats = [
  {
    title: "Add",
    value: isLoading
      ? "-"
      : actionLogCount
        ? actionLogCount.add.toString()
        : "0",
    icon: LinkIcon,
  },
  // ...
];
```

### 2. アプリケーション層 (フック)

#### useActionLogCount (useActionLogCount.ts)

- SWRを使用したデータ取得とキャッシュ管理
- エラーハンドリングとローディング状態の管理
- キャッシュキーの管理

```tsx
export const useActionLogCount = (userId: string) => {
  // SWRを使用してデータを取得
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }
      const repository = new ActionLogCountRepository();
      const service = new ActionLogCountService(repository);
      return service.getTodayActionLogCount(userId);
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 3,
    },
  );

  return { data, error, isLoading, mutate };
};
```

#### usePeriodActionLogCount (useActionLogCount.ts)

- 期間指定でのアクションログカウント取得
- 日付範囲パラメータの処理
- キャッシュキーの管理

```tsx
export const usePeriodActionLogCount = (
  userId: string,
  startDate: string,
  endDate: string,
) => {
  // SWRを使用してデータを取得
  const { data, error, isLoading, mutate } = useSWR(
    userId
      ? ACTION_LOG_CACHE_KEYS.PERIOD_ACTION_LOG_COUNT(
          userId,
          startDate,
          endDate,
        )
      : null,
    async () => {
      if (!userId) {
        return null;
      }

      // 各アクションタイプごとのカウントを取得
      const repository = new ActionLogCountRepository();
      const addCount = await repository.getActionLogCount({
        userId,
        actionType: ActionType.ADD,
        startDate,
        endDate,
      });

      // ...

      return {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      } as ActionLogCount;
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 3,
    },
  );

  return { data, error, isLoading, mutate };
};
```

#### useLinkStatusCount (useLinkStatusCount.ts)

- リンクのステータス別カウントを取得するフック
- `read`、`reread`、`bookmark`の各状態のカウントを取得
- 汎用的なProgressBarコンポーネントで表示するためのデータ形式を提供

```tsx
export interface LinkStatusCount {
  total: number;
  read: number; // 'Read'ステータスかつre_read=falseのリンク数
  reread: number; // re_read=trueかつ特定のステータスのリンク数
  bookmark: number;
}

export const useLinkStatusCount = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }

      try {
        return await linkService.getUserLinkStatusCounts(userId);
      } catch (error) {
        console.error("[useLinkStatusCount] Error fetching data:", error);
        throw error;
      }
    },
    SWR_DISPLAY_CONFIG,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
```

#### useSwipeStatusCount (useSwipeStatusCount.ts)

- スワイプアクションのステータス別カウントを取得するフック
- `Today`、`inWeekend`、`Skip`の各操作のカウントを取得
- 統計情報の可視化のためのデータを提供

```tsx
export interface SwipeStatusCount {
  total: number;
  today: number;
  inWeekend: number;
  skip: number;
}

export const useSwipeStatusCount = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }

      try {
        // APIからデータを取得
        const swipeCount =
          await actionLogCountRepository.getTotalActionCountByStatus({
            userId,
            statuses: [
              ActionStatus.TODAY,
              ActionStatus.IN_WEEKEND,
              ActionStatus.SKIP,
            ],
          });

        // 各ステータスのカウントを計算
        const todayCount =
          swipeCount.find(
            (item: StatusCount) => item.status === ActionStatus.TODAY,
          )?.count || 0;

        const inWeekendCount =
          swipeCount.find(
            (item: StatusCount) => item.status === ActionStatus.IN_WEEKEND,
          )?.count || 0;

        const skipCount =
          swipeCount.find(
            (item: StatusCount) => item.status === ActionStatus.SKIP,
          )?.count || 0;

        // 合計を計算
        const total = todayCount + inWeekendCount + skipCount;

        return {
          total,
          today: todayCount,
          inWeekend: inWeekendCount,
          skip: skipCount,
        } as SwipeStatusCount;
      } catch (error) {
        console.error("[useSwipeStatusCount] Error fetching data:", error);
        throw error;
      }
    },
    SWR_DISPLAY_CONFIG,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
```

## リンクステータスカウントの実装詳細

`getUserLinkStatusCounts`メソッドは、ユーザーのリンクステータスに関する以下の集計情報を提供します：

1. **total**：ユーザーの全リンク数
2. **read**：'Read'ステータスかつre_read=falseのリンク数（初回読了のみ）
3. **reread**：re_read=trueのリンク数（'Skip'、'Today'、'inMonth'、'Read'ステータスのいずれか）
4. **bookmark**：'Bookmark'ステータスのリンク数

実装上の重要な点：

- 'Read'ステータスのリンクでre_read=trueのものは、`read`カウントではなく`reread`カウントに含まれます。
- これにより、リンクの初回読了と再読の状態を明確に分離して集計できます。

```tsx
// リンクステータスカウント取得の実装例（抜粋）
const getUserLinkStatusCounts = async (userId: string) => {
  // すべてのリンク数を取得
  const { count: totalCount } = await supabase
    .from("user_links_with_actions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // 各ステータスごとに取得
  const statusCounts = await Promise.all([
    // Readカウント: 'Read'ステータスかつre_read=falseのみ
    supabase
      .from("user_links_with_actions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "Read")
      .eq("re_read", false),

    // Bookmarkカウント
    supabase
      .from("user_links_with_actions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "Bookmark"),

    // Re-Readカウント: re_read=true かつ特定のステータス
    supabase
      .from("user_links_with_actions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("re_read", true)
      .in("status", ["Skip", "Today", "inMonth", "Read"]),
  ]);

  return {
    total: totalCount || 0,
    read: statusCounts[0].count || 0,
    bookmark: statusCounts[1].count || 0,
    reread: statusCounts[2].count || 0,
  };
};
```

このようにして、リンクの状態を正確に集計し、ダッシュボードで視覚化しています。

これらのステータスカウントフックは、ダッシュボード画面で`StatusOverview`コンポーネントを通じて表示されます。各フックは特定のデータタイプに対応していますが、汎用的なコンポーネントで表示できるよう、共通のデータ構造を持っています。

### 3. アプリケーション層 (サービス)

#### actionLogCountService (actionLogCountService.ts)

- ビジネスロジックの実装
- 各アクションタイプのカウント取得
- 日付処理

```tsx
export class ActionLogCountService implements IActionLogCountService {
  constructor(
    private readonly actionLogCountRepository: IActionLogCountRepository,
  ) {}

  async getTodayActionLogCount(userId: string): Promise<ActionLogCount> {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0]; // YYYY-MM-DD形式
    const endDate = startDate;

    try {
      // 各アクションタイプごとのカウントを取得
      const addCount = await this.actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.ADD,
        startDate,
        endDate,
      });

      const swipeCount = await this.actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.SWIPE,
        startDate,
        endDate,
      });

      const readCount = await this.actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.READ,
        startDate,
        endDate,
      });

      return {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      };
    } catch (error) {
      console.error("アクションログカウントの取得に失敗しました:", error);
      throw error;
    }
  }
}
```

### 4. インフラストラクチャ層 (リポジトリ)

#### ActionLogCountRepository (actionLogCountApi.ts)

- データアクセスロジックの抽象化
- APIの呼び出し

```tsx
export class ActionLogCountRepository implements IActionLogCountRepository {
  async getActionLogCount(params: {
    userId: string;
    actionType: ActionType;
    startDate?: string;
    endDate?: string;
  }): Promise<number> {
    return actionLogCountApi.fetchActionLogCountByType(params);
  }
}
```

### 5. インフラストラクチャ層 (API)

#### actionLogCountApi (actionLogCountApi.ts)

- Supabaseとの通信
- クエリの構築
- エラーハンドリング

```tsx
export const actionLogCountApi = {
  fetchActionLogCountByType: async (params: {
    userId: string;
    actionType: ActionType;
    startDate?: string;
    endDate?: string;
  }): Promise<number> => {
    try {
      // アクションタイプに対応するステータスのリストを取得
      const statuses = Object.entries(statusToTypeMap)
        .filter(([_, type]) => type === params.actionType)
        .map(([status, _]) => status);

      if (statuses.length === 0) {
        return 0;
      }

      let query = supabase
        .from("user_link_actions_log")
        .select("*", { count: "exact", head: true })
        .eq("user_id", params.userId)
        .in("new_status", statuses);

      // 日付範囲が指定されている場合、フィルタを追加
      if (params.startDate) {
        query = query.gte("changed_at", `${params.startDate}T00:00:00`);
      }

      if (params.endDate) {
        query = query.lte("changed_at", `${params.endDate}T23:59:59`);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("Error fetching action log count by type:", error);
      throw error;
    }
  },
};
```

## キャッシュ戦略

### キャッシュキー (actionLogCacheKeys.ts)

キャッシュキーを一元管理することで、キャッシュの一貫性を保ちます。

```tsx
export const ACTION_LOG_CACHE_KEYS = {
  /**
   * 今日のアクションログカウント用キャッシュキー
   * @param userId ユーザーID
   * @returns キャッシュキー
   */
  TODAY_ACTION_LOG_COUNT: (userId: string) => [
    "today-action-log-count",
    userId,
  ],

  /**
   * 期間指定のアクションログカウント用キャッシュキー
   * @param userId ユーザーID
   * @param startDate 開始日
   * @param endDate 終了日
   * @returns キャッシュキー
   */
  PERIOD_ACTION_LOG_COUNT: (
    userId: string,
    startDate: string,
    endDate: string,
  ) => ["period-action-log-count", userId, startDate, endDate],

  /**
   * 特定のアクションタイプのカウント用キャッシュキー
   * @param userId ユーザーID
   * @param actionType アクションタイプ
   * @param startDate 開始日
   * @param endDate 終了日
   * @returns キャッシュキー
   */
  ACTION_TYPE_COUNT: (
    userId: string,
    actionType: string,
    startDate?: string,
    endDate?: string,
  ) => ["action-type-count", userId, actionType, startDate, endDate],
};
```

### キャッシュサービス (actionLogCacheService.ts)

キャッシュ更新ロジックを集約することで、キャッシュの一貫性を保ちます。

```tsx
export const actionLogCacheService = {
  /**
   * アクションログカウント取得後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterActionLogCount: (userId: string, mutate: ScopedMutator): void => {
    // 今日のアクションログカウントのキャッシュを更新
    mutate(ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId));
  },

  /**
   * アクションログ追加後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterActionLogAdd: (userId: string, mutate: ScopedMutator): void => {
    // アクションログ追加後は全てのアクションログ関連キャッシュを更新
    mutate(isActionLogCache);
  },
};
```

## データ取得の最適化

### 1. SWRの活用

- `revalidateOnFocus`: フォーカス時に自動的にデータを再検証
- `revalidateOnReconnect`: ネットワーク再接続時に自動的にデータを再検証
- `dedupingInterval`: 重複リクエストを防止
- `errorRetryCount`: エラー時の再試行回数

### 2. キャッシュの一元管理

- キャッシュキーの一元管理
- キャッシュ更新ロジックの集約
- パターンマッチングによる効率的なキャッシュ更新

### 3. クエリの最適化

- 必要なデータのみを取得
- 適切なインデックスの使用
- 効率的なフィルタリング

## エラーハンドリング

### 1. API層でのエラーハンドリング

```tsx
try {
  // ...
  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count || 0;
} catch (error) {
  console.error("Error fetching action log count by type:", error);
  throw error;
}
```

### 2. サービス層でのエラーハンドリング

```tsx
try {
  // ...
  return {
    add: addCount,
    swipe: swipeCount,
    read: readCount,
  };
} catch (error) {
  console.error("アクションログカウントの取得に失敗しました:", error);
  throw error;
}
```

### 3. フック層でのエラーハンドリング

```tsx
const { data, error, isLoading } = useSWR(
  // ...
  {
    errorRetryCount: 3,
  },
);

return { data, error, isLoading, mutate };
```

### 4. プレゼンテーション層でのエラーハンドリング

```tsx
{
  error && (
    <View className="mt-2">
      <ThemedText
        text="データの取得に失敗しました"
        variant="caption"
        weight="medium"
        color="error"
      />
    </View>
  );
}
```

## 今後の改善点

### 1. バッチ処理の導入

- 複数のアクションタイプのカウントを一度のクエリで取得
- N+1問題の解消

### 2. リアルタイム更新

- Supabaseのリアルタイムサブスクリプションを活用
- アクションログの変更をリアルタイムで反映

### 3. データプリフェッチ

- 画面遷移前にデータを事前に取得
- ユーザー体験の向上

### 4. オフラインサポート

- オフライン時のデータ取得
- オフライン時の変更の追跡と同期

### 5. パフォーマンスモニタリング

- データ取得時間の計測
- ボトルネックの特定と改善

# データフェッチング

このドキュメントでは、ダッシュボード機能におけるデータフェッチングの実装パターンについて説明します。

## SWRを使用したデータフェッチング

ダッシュボード機能では、SWRを使用してデータフェッチングを実装しています。SWRは以下の利点を提供します：

1. **キャッシュと再検証**

   - 自動的なキャッシュ管理
   - バックグラウンドでの再検証
   - 最新データの自動更新

2. **エラーハンドリング**

   - エラー状態の管理
   - 再試行メカニズム
   - エラー時のフォールバック

3. **ローディング状態**
   - 初期ローディング
   - 再検証中のローディング
   - スケルトンUIとの連携

## 実装パターン

### 1. フェッチャー関数の定義

```typescript
// インフラストラクチャ層
const fetchWeeklyActivity = async (userId: string) => {
  const repository = new WeeklyActivityRepository();
  return weeklyActivityService.getWeeklyActivity(repository, userId);
};
```

### 2. カスタムフックの実装

```typescript
// アプリケーション層
export const useWeeklyActivity = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading } = useSWR(
    userId ? [CACHE_KEYS.WEEKLY_ACTIVITY, userId] : null,
    ([_, id]) => fetchWeeklyActivity(id),
  );

  return {
    data,
    error,
    isLoading,
  };
};
```

### 3. コンポーネントでの使用

```typescript
// プレゼンテーション層
const WeeklyActivityView = () => {
  const { data, error, isLoading } = useWeeklyActivity();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return <WeeklyActivityChart data={data} />;
};
```

## キャッシュ管理

### キャッシュキーの定義

```typescript
export const CACHE_KEYS = {
  WEEKLY_ACTIVITY: "weekly-activity",
  ACTION_LOG_COUNT: "action-log-count",
} as const;
```

### キャッシュの更新

```typescript
export const updateWeeklyActivityCache = async (userId: string) => {
  await mutate([CACHE_KEYS.WEEKLY_ACTIVITY, userId]);
};
```

## エラーハンドリング

エラーハンドリングは以下の階層で実装されています：

1. **インフラストラクチャ層**

   - APIエラーのキャッチ
   - ネットワークエラーの処理
   - 型安全なエラーオブジェクトの生成

2. **アプリケーション層**

   - ビジネスロジックに関連するエラーの処理
   - エラーメッセージの変換
   - エラー状態の管理

3. **プレゼンテーション層**
   - ユーザーフレンドリーなエラー表示
   - エラーリカバリーのUI
   - 再試行メカニズム

## 実装例：WeeklyActivity

### 1. リポジトリ層

```typescript
export const weeklyActivityRepository = {
  fetchActivityLogs: async (
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityLog[]> => {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("changed_at", startDate.toISOString())
      .lte("changed_at", endDate.toISOString());

    if (error) throw new Error("Failed to fetch activity logs");
    return data;
  },
};
```

### 2. サービス層

```typescript
export const weeklyActivityService = {
  getWeeklyActivity: async (
    repository: IWeeklyActivityRepository,
    userId: string,
  ): Promise<WeeklyActivityViewModel> => {
    const endDate = new Date();
    const startDate = subDays(endDate, 6);

    const logs = await repository.fetchActivityLogs(userId, startDate, endDate);
    return transformToViewModel(logs);
  },
};
```

### 3. フック層

```typescript
export const useWeeklyActivity = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useSWR(
    userId ? [CACHE_KEYS.WEEKLY_ACTIVITY, userId] : null,
    ([_, id]) =>
      weeklyActivityService.getWeeklyActivity(weeklyActivityRepository, id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1分ごとに更新
    },
  );
};
```

## パフォーマンス最適化

1. **キャッシュ戦略**

   - 適切なキャッシュ期間の設定
   - 条件付き再検証
   - プリフェッチの活用

2. **データ変換**

   - 必要最小限のデータ取得
   - 効率的なデータ変換
   - メモ化の活用

3. **エラー処理**
   - 適切な再試行戦略
   - グレースフルデグラデーション
   - フォールバックUIの提供

## ベストプラクティス

1. **型安全性**

   - 厳密な型定義
   - 実行時型チェック
   - エラー型の定義

2. **テスト容易性**

   - モック可能な設計
   - 依存性の明示的な注入
   - テスト用ユーティリティの提供

3. **保守性**
   - 責務の明確な分離
   - 一貫した命名規則
   - 適切なドキュメント化

## データフェッチの最適化（関数ベースアーキテクチャ）

ダッシュボード機能では、データフェッチングのコードをクラスベースから関数ベースに移行することで、より簡潔で効率的な実装にリファクタリングしています。

### 関数ベースアーキテクチャのメリット

1. **シンプルな依存関係管理**

   - クラスのインスタンス化不要
   - 依存関係の明示的な受け渡し
   - モック化が容易

2. **純粋関数による副作用の最小化**

   - 予測可能な動作
   - デバッグしやすい
   - テスト容易性の向上

3. **コード量の削減**
   - ボイラープレートコードの削減
   - シンプルなインターフェース
   - メンテナンス性の向上

### リファクタリング例：アクションログカウント

#### リポジトリ層（変更前）

```typescript
export class ActionLogCountRepository implements IActionLogCountRepository {
  async getActionLogCount({
    userId,
    actionType,
    startDate,
    endDate,
  }: GetActionLogCountParams): Promise<number> {
    // Supabaseクエリ実行
    const { count, error } = await supabase
      .from("user_link_actions_log")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("new_status", getStatusesByType(actionType))
      .gte("changed_at", startDate)
      .lte("changed_at", endDate);

    if (error)
      throw new Error(`Failed to fetch action log count: ${error.message}`);
    return count || 0;
  }
}
```

#### リポジトリ層（変更後）

```typescript
export const actionLogCountRepository = {
  async getActionLogCount({
    userId,
    actionType,
    startDate,
    endDate,
  }: GetActionLogCountParams): Promise<number> {
    // Supabaseクエリ実行
    const { count, error } = await supabase
      .from("user_link_actions_log")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("new_status", getStatusesByType(actionType))
      .gte("changed_at", startDate)
      .lte("changed_at", endDate);

    if (error)
      throw new Error(`Failed to fetch action log count: ${error.message}`);
    return count || 0;
  },
};
```

#### サービス層（変更前）

```typescript
export class ActionLogCountService {
  private repository: IActionLogCountRepository;

  constructor(repository: IActionLogCountRepository) {
    this.repository = repository;
  }

  async getTodayActionLogCount(userId: string): Promise<ActionLogCount> {
    const today = new Date().toISOString().split("T")[0];

    // 各アクションタイプのカウントを並列取得
    const [addCount, swipeCount, readCount] = await Promise.all([
      this.repository.getActionLogCount({
        userId,
        actionType: ActionType.ADD,
        startDate: today,
        endDate: today,
      }),
      this.repository.getActionLogCount({
        userId,
        actionType: ActionType.SWIPE,
        startDate: today,
        endDate: today,
      }),
      this.repository.getActionLogCount({
        userId,
        actionType: ActionType.READ,
        startDate: today,
        endDate: today,
      }),
    ]);

    return {
      add: addCount,
      swipe: swipeCount,
      read: readCount,
    };
  }
}
```

#### サービス層（変更後）

```typescript
export const actionLogCountService = {
  async getTodayActionLogCount(userId: string): Promise<ActionLogCount> {
    const { startUTC, endUTC } = dateUtils.getDateRangeForFetch();

    // 各アクションタイプのカウントを並列取得
    const [addCount, swipeCount, readCount] = await Promise.all([
      actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.ADD,
        startDate: startUTC,
        endDate: endUTC,
      }),
      actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.SWIPE,
        startDate: startUTC,
        endDate: endUTC,
      }),
      actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.READ,
        startDate: startUTC,
        endDate: endUTC,
      }),
    ]);

    return {
      add: addCount,
      swipe: swipeCount,
      read: readCount,
    };
  },
};
```

#### フック層（変更前）

```typescript
export function useActionLogCount(userId: string | undefined) {
  const repository = new ActionLogCountRepository();
  const service = new ActionLogCountService(repository);

  return useSWR(
    userId ? ["today-action-log-count", userId] : null,
    async () => {
      if (!userId) return null;
      return service.getTodayActionLogCount(userId);
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 3,
    },
  );
}
```

#### フック層（変更後）

```typescript
export function useActionLogCount(userId: string | undefined) {
  return useSWR(
    ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId),
    async () => {
      if (!userId) return null;
      return actionLogCountService.getTodayActionLogCount(userId);
    },
    SWR_DEFAULT_CONFIG,
  );
}
```

### キャッシュキー管理

キャッシュキーの管理も集約し、メンテナンス性を向上させています。

```typescript
export const ACTION_LOG_CACHE_KEYS = {
  TODAY_ACTION_LOG_COUNT: (userId: string | undefined) =>
    userId ? ["today-action-log-count", userId] : null,

  PERIOD_ACTION_LOG_COUNT: (
    userId: string | undefined,
    startDate: string,
    endDate: string,
  ) =>
    userId ? ["period-action-log-count", userId, startDate, endDate] : null,

  ACTION_LOG_COUNT_BY_TYPE: (
    userId: string | undefined,
    actionType: ActionType,
  ) => (userId ? ["action-log-count-type", userId, actionType] : null),
};
```

### SWR設定の標準化

SWRの設定も共通化し、一貫性のあるデータフェッチング設定を提供します。

```typescript
export const SWR_DEFAULT_CONFIG = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,
  errorRetryCount: 3,
};
```

## DataFetchState コンポーネント

データフェッチングの状態管理を統一するため、新たに `DataFetchState`
コンポーネントを導入しました。このコンポーネントは、ローディング状態、エラー状態、データ表示を一元管理します。

### 実装

```tsx
interface DataFetchStateProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
}

export const DataFetchState: React.FC<DataFetchStateProps> = ({
  isLoading,
  error,
  children,
}) => {
  if (isLoading) {
    return <LoadingIndicator message="読み込み中..." />;
  }

  if (error) {
    return <ErrorDisplay message="データの取得に失敗しました" />;
  }

  return <>{children}</>;
};
```

### 使用例

#### 変更前

```tsx
export const ActionLogCountView: React.FC = () => {
  const { data, error, isLoading } = useActionLogCount(userId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!data) {
    return null;
  }

  return <ActionLogCountDisplay data={data} />;
};
```

#### 変更後

```tsx
export const ActionLogCountView: React.FC = () => {
  const { data, error, isLoading } = useActionLogCount(userId);

  return (
    <DataFetchState isLoading={isLoading} error={error}>
      {data && <ActionLogCountDisplay data={data} />}
    </DataFetchState>
  );
};
```

### メリット

1. **コードの再利用性**

   - 同じパターンを複数のビューで重複して実装する必要がない
   - 一貫したユーザー体験を提供

2. **保守性の向上**

   - ローディングやエラー表示のロジックを一箇所で管理
   - UIの変更が必要な場合も一箇所の修正で済む

3. **宣言的なコード**
   - 条件分岐が減少し、コードの可読性が向上
   - データの状態に応じた表示が明示的

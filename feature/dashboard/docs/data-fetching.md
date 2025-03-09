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

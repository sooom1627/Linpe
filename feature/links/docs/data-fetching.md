# SwipeScreen データ取得フロー

## 概要

SwipeScreenは、ユーザーがリンクをスワイプして分類するための画面です。このドキュメントでは、SwipeScreenでのデータ取得フローについて説明します。

## データフロー

```
SwipeScreen (Presentation)
    ↓
useSwipeScreenLinks (Application Hook)
    ↓
swipeableLinkService.fetchSwipeableLinks (Application Service)
    ↓
linkApi.fetchUserLinksWithCustomQuery (Infrastructure API)
    ↓
Supabase (Database)
```

## 各レイヤーの役割

### 1. Presentation Layer (SwipeScreen.tsx)

- ユーザーインターフェースの表示
- データの取得状態に応じた表示の切り替え（ローディング、エラー、データなし、データあり）
- 取得したデータを使用してカードの表示

```tsx
const {
  links: userLinks,
  isError,
  isLoading,
  isEmpty,
} = useSwipeScreenLinks(session?.user?.id ?? null);
```

### 2. Application Layer (Hooks)

#### useSwipeScreenLinks (useLinks.ts)

- SWRを使用したデータ取得とキャッシュ管理
- エラーハンドリングとローディング状態の管理
- データの有無の判定

```tsx
export const useSwipeScreenLinks = (
  userId: string | null,
  limit: number = 20,
): {
  links: UserLink[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
} => {
  const { data, error } = useSWR(
    userId ? ["swipeable-links", userId] : null,
    () => swipeableLinkService.fetchSwipeableLinks(userId!, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    links: data || [],
    isLoading: !error && !data,
    isError: !!error,
    isEmpty: Array.isArray(data) && data.length === 0,
  };
};
```

### 3. Application Layer (Services)

#### swipeableLinkService.fetchSwipeableLinks (swipeableLinkService.ts)

- ビジネスロジックの実装
- 適切なAPIメソッドの選択と呼び出し
- エラーハンドリング

```tsx
export const swipeableLinkService = {
  fetchSwipeableLinks: async (
    userId: string,
    limit: number = 20,
  ): Promise<UserLink[]> => {
    try {
      // カスタムクエリを使用してスワイプ可能なリンクを取得
      return await linkApi.fetchUserLinksWithCustomQuery({
        userId,
        limit,
        queryBuilder: (query) => {
          // スワイプ可能なリンクの条件を定義
          return query.or(
            "status.eq.add,status.eq.inWeekend,status.eq.Re-Read",
          );
        },
        orderBy: "link_updated_at",
        ascending: true,
      });
    } catch (error) {
      console.error("Error fetching swipeable links:", error);
      throw error;
    }
  },
};
```

### 4. Infrastructure Layer (API)

#### linkApi.fetchUserLinksWithCustomQuery (linkApi.ts)

- データベースとの通信
- クエリの構築と実行
- エラーハンドリング

```tsx
export const linkApi = {
  // ... 他のメソッド

  fetchUserLinksWithCustomQuery: async (params: {
    userId: string;
    limit: number;
    queryBuilder: (query: QueryBuilder) => QueryBuilder;
    orderBy?: string;
    ascending?: boolean;
  }) => {
    let query = supabase
      .from("user_links_with_actions")
      .select(USER_LINKS_SELECT)
      .eq("user_id", params.userId);

    // カスタムクエリビルダーを適用
    query = params.queryBuilder(query);

    return executeQuery<UserLink>(
      query,
      {
        orderBy: params.orderBy,
        ascending: params.ascending,
        limit: params.limit,
      },
      "Error fetching user links with custom query:"
    );
  },
};

/**
 * 共通のクエリ実行関数
 * @param baseQuery 基本クエリ
 * @param params クエリパラメータ
 * @param errorMessage エラーメッセージ
 * @returns クエリ結果
 */
const executeQuery = async <T>(
  baseQuery: QueryBuilder,
  params: {
    orderBy?: string;
    ascending?: boolean;
    limit: number;
  },
  errorMessage: string
): Promise<T[]> => {
  try {
    let query = baseQuery;

    if (params.orderBy) {
      query = query.order(params.orderBy, { ascending: params.ascending });
    }

    const { data, error } = await query.limit(params.limit);

    if (error) {
      throw error;
    }

    return data as T[];
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};
```

## データ取得条件

SwipeScreenでは、以下の条件を満たすリンクを取得します：

1. 指定されたユーザーID（`userId`）に関連するリンク
2. 以下のいずれかの条件を満たすリンク：
   - ステータスが `add`、`inWeekend`、`Re-Read` のいずれか
   - または、読む予定日が現在時刻より前で、かつ今日の日付ではないリンク
3. 以下の優先順位で並べられたリンク：
   - 優先順位1: ステータスが `add` のリンク
   - 優先順位2: 読む予定日が現在時刻より前で、かつ今日の日付ではないリンク
   - 優先順位3: ステータスが `inWeekend`、`Re-Read` のリンク（ランダム順）
4. 最大20件のリンク

## 責任の分離

新しい設計では、責任が明確に分離されています：

1. **インフラストラクチャレイヤー（API）**

   - 基本的なデータ取得機能を提供
   - 汎用的なクエリビルダーを受け付ける柔軟なインターフェースを提供
   - 共通のクエリ実行ロジックを`executeQuery`関数に抽出し、コードの重複を削減

2. **アプリケーションレイヤー（サービス）**

   - ビジネスロジックを実装（スワイプ可能なリンクの条件判定など）
   - 適切なAPIメソッドを選択して呼び出し

3. **プレゼンテーションレイヤー（フック、UI）**
   - データの取得状態に応じたUIの表示
   - キャッシュ管理

この分離により、各レイヤーの責任が明確になり、テストや保守が容易になります。

## エラーハンドリング

各レイヤーでエラーハンドリングを行い、エラーが発生した場合は上位レイヤーにエラーを伝播させます。最終的にSwipeScreenでエラー状態を表示します。

## キャッシュ戦略

SWRを使用してデータをキャッシュし、以下の設定を行っています：

- `revalidateOnFocus: false` - 画面にフォーカスが当たった時に再検証しない
- `revalidateOnReconnect: false` - ネットワーク接続が回復した時に再検証しない

これにより、不要な再取得を防ぎ、パフォーマンスを向上させています。

## 注意点

1. ユーザーIDが`null`の場合、データ取得は行われません
2. データが空の場合、`NoLinksStatus`コンポーネントが表示されます
3. エラーが発生した場合、`ErrorStatus`コンポーネントが表示されます
4. データ取得中は、`LoadingStatus`コンポーネントが表示されます
5. **`scheduled_read_at`が今日の日付のリンクは表示されません**
6. **`scheduled_read_at`が未来の日付のリンクは表示されません**

## 今後の改善点

1. より詳細なエラーメッセージの表示
2. リトライ機能の実装
3. オフライン対応の強化
4. パフォーマンス最適化（必要に応じて）

# リンク削除機能のデータフロー

## 概要

リンク削除機能は、ユーザーが不要になったリンクを削除するための機能です。この機能は主にLinkActionViewから利用され、削除後はSWRのキャッシュを更新してUIを最新の状態に保ちます。

## データフロー

```
LinkActionView (Presentation)
    ↓
useLinkAction (Application Hook)
    ↓
linkActionService.deleteLinkAction / updateLinkActionBySwipe / updateLinkActionByReadStatus (Application Service)
    ↓
linkActionsApi.deleteLinkAction / updateLinkAction (Infrastructure API)
    ↓
Supabase (Database)
```

## 各レイヤーの役割

### 1. Presentation Layer (LinkActionView.tsx)

- ユーザーインターフェースの表示
- 削除ボタンと各種マークボタンの提供
- 削除処理とマーク処理の実行

```tsx
// 削除処理
const handleDelete = async () => {
  const { userId, linkId } = params;

  if (!userId || !linkId) {
    console.error("No linkId or userId in params");
    onClose();
    return;
  }

  try {
    await deleteLinkAction(userId, linkId);
  } catch (error) {
    console.error("Error in handleDelete:", error);
  } finally {
    onClose();
  }
};

// マーク処理
const handleMarkAsRead = async () => {
  if (!selectedMark) return;

  const { userId, linkId, swipeCount } = params;

  if (!userId || !linkId) {
    console.error("No linkId or userId in params");
    onClose();
    return;
  }

  try {
    // SelectedMarkをそのままStatusとして使用
    const status = selectedMark as "Read" | "Reading" | "Re-Read" | "Bookmark";

    // swipeCountを数値に変換（存在しない場合は0を使用）
    const swipeCountNum = swipeCount ? parseInt(swipeCount, 10) : 0;

    // 新しいメソッドを使用
    await updateLinkActionByReadStatus(userId, linkId, status, swipeCountNum);
    onClose();
  } catch (error) {
    console.error("Error in handleMarkAsRead:", error);
    onClose();
  }
};
```

### 2. Application Layer (Hooks)

#### useLinkAction (useLinkAction.ts)

- 状態管理（ローディング、エラー）
- サービスの呼び出し
- キャッシュの更新
- 通知の表示

```tsx
// スワイプ操作によるリンクアクションの更新
const updateLinkActionBySwipe = async (
  userId: string,
  linkId: string,
  status: "Today" | "inWeekend",
  swipeCount: number,
) => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await linkActionService.updateLinkActionBySwipe(
      userId,
      linkId,
      status,
      swipeCount,
    );

    if (result.success) {
      // キャッシュの更新
      linkCacheService.updateAfterLinkAction(userId, mutate);
      // スワイプ操作では通知を表示しない
    } else {
      // エラー通知
      notificationService.error(
        "リンクの更新に失敗しました",
        result.error?.message || "不明なエラーが発生しました",
        { position: "top", offset: 70, duration: 3000 },
      );
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    throw err;
  } finally {
    setIsLoading(false);
  }
};

// 読書状態によるリンクアクションの更新
const updateLinkActionByReadStatus = async (
  userId: string,
  linkId: string,
  status: "Read" | "Reading" | "Re-Read" | "Bookmark",
  swipeCount: number,
) => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await linkActionService.updateLinkActionByReadStatus(
      userId,
      linkId,
      status,
      swipeCount,
    );

    if (result.success) {
      // キャッシュの更新
      linkCacheService.updateAfterLinkAction(userId, mutate);

      // 成功通知
      notificationService.success(
        "リンクが更新されました",
        `ステータス: ${status}`,
        {
          position: "top",
          offset: 70,
          duration: 3000,
        },
      );
    } else {
      // エラー通知
      notificationService.error(
        "リンクの更新に失敗しました",
        result.error?.message || "不明なエラーが発生しました",
        { position: "top", offset: 70, duration: 3000 },
      );
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    throw err;
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Application Layer (Services)

#### linkActionService (linkActionService.ts)

- ビジネスロジックの実装
- APIの呼び出し
- エラーハンドリング

```tsx
// スワイプ操作によるリンクアクションの更新
async updateLinkActionBySwipe(
  userId: string,
  linkId: string,
  status: "Today" | "inWeekend",
  swipeCount: number,
): Promise<UpdateLinkActionResponse> {
  try {
    const params: UpdateLinkActionParams = {
      userId,
      linkId,
      status,
      swipeCount,
      scheduled_read_at: calculateScheduledDate(status).toISOString(),
      // read_atは指定しない（undefinedの場合、APIで更新対象から除外される）
    };

    return await this._callUpdateLinkActionApi(params);
  } catch (error) {
    return this._handleServiceError(error, "updateLinkActionBySwipe");
  }
}

// 読書状態によるリンクアクションの更新
async updateLinkActionByReadStatus(
  userId: string,
  linkId: string,
  status: "Read" | "Reading" | "Re-Read" | "Bookmark",
  swipeCount: number,
): Promise<UpdateLinkActionResponse> {
  try {
    // Readingの場合はread_atを更新しない
    const read_at = status !== "Reading" ? new Date().toISOString() : null;

    const params: UpdateLinkActionParams = {
      userId,
      linkId,
      status,
      swipeCount,
      read_at,
      // Read状態の場合はscheduled_read_atを設定しない
      scheduled_read_at: status !== "Read" ? calculateScheduledDate(status).toISOString() : undefined,
    };

    return await this._callUpdateLinkActionApi(params);
  } catch (error) {
    return this._handleServiceError(error, "updateLinkActionByReadStatus");
  }
}

// 共通のAPI呼び出し処理
private async _callUpdateLinkActionApi(
  params: UpdateLinkActionParams
): Promise<UpdateLinkActionResponse> {
  const response = await linkActionsApi.updateLinkAction(params);

  // レスポンスの検証
  if (!response.success || !response.data) {
    console.error("Failed to update link action:", {
      success: response.success,
      error: response.error,
      data: response.data,
      params,
    });
  }

  return response;
}
```

### 4. Infrastructure Layer (API)

#### linkActionsApi.updateLinkAction (linkActionsApi.ts)

- データベースとの通信
- パラメータのバリデーション
- エラーハンドリング

```tsx
async updateLinkAction(
  params: UpdateLinkActionParams,
): Promise<UpdateLinkActionResponse> {
  try {
    LinkActionsApi.validateParams(params);

    // 更新対象のデータを準備
    const updateData: {
      status: string;
      updated_at: string;
      swipe_count: number;
      scheduled_read_at?: string | null;
      read_at?: string | null;
    } = {
      status: params.status,
      updated_at: getCurrentISOTime(),
      swipe_count: params.swipeCount + 1,
    };

    // scheduled_read_atが指定されている場合のみ更新対象に含める
    if (params.scheduled_read_at !== undefined) {
      updateData.scheduled_read_at = params.scheduled_read_at;
    }

    // read_atが指定されている場合のみ更新対象に含める
    if (params.read_at !== undefined) {
      updateData.read_at = params.read_at;
    }

    const { data, error } = await supabase
      .from("user_link_actions")
      .update(updateData)
      .eq("link_id", params.linkId)
      .eq("user_id", params.userId)
      .select()
      .single();

    if (error) {
      return this.handleUpdateSupabaseError(error, "updateLinkAction");
    }

    return {
      success: true,
      data: data as UserLinkActionsRow,
      error: null,
    };
  } catch (error) {
    console.error("Error in updateLinkAction:", error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}
```

## キャッシュ更新

リンクアクションが実行された後、関連するキャッシュを更新するために`linkCacheService.updateAfterLinkAction`メソッドが呼び出されます：

```tsx
// キャッシュ更新
linkCacheService.updateAfterLinkAction(userId, mutate);
```

以下のキャッシュが更新されます：

1. `["today-links", userId]` - 今日読むリンクのキャッシュ
2. `["swipeable-links", userId]` - スワイプ可能なリンクのキャッシュ
3. `[user-links-${userId}, 10]` - ユーザーリンクのキャッシュ
4. その他の"links"を含むすべてのキャッシュ

これにより、削除されたリンクがUIから即座に消えるようになります。

## エラーハンドリング

各レイヤーでエラーハンドリングを行い、エラーが発生した場合は上位レイヤーにエラーを伝播させます。最終的にユーザーに通知サービスを通じてエラーを表示します。

## 注意点

1. URLパラメータから`userId`と`linkId`を取得するため、これらのパラメータが存在しない場合は処理を中断します
2. 削除処理は非同期で行われ、処理中はボタンのローディング状態が表示されます
3. 削除が完了すると、モーダルは自動的に閉じられます
4. キャッシュ更新サービスにより、リストビューが自動的に更新されます
5. 通知サービスを使用して、処理結果をユーザーに伝えます
6. スワイプ操作では`read_at`を更新しないように設計されています

## 今後の改善点

1. 削除前の確認ダイアログの追加
2. 削除の取り消し機能（Undo）の実装
3. 一括削除機能の追加
4. 削除理由の記録（オプション）
5. オフライン時の削除キューの実装

// 注: 上記のコードは現在は使用されていません。代わりに以下のキャッシュ中央管理システムが使用されています。

/\*\*

- キャッシュ中央管理システム
-
- キャッシュの更新を一元管理するために、以下のコンポーネントが導入されています：
-
- 1.  linkCacheKeys - キャッシュキーの定数と判定関数
- 2.  linkCacheService - キャッシュ更新ロジック
-
- 使用例：\*/

// キャッシュキーの定義 export const LINK_CACHE_KEYS = { TODAY_LINKS: (userId:
string) => ["today-links", userId], SWIPEABLE_LINKS: (userId: string) =>
["swipeable-links", userId], USER_LINKS: (userId: string, limit: number = 10) =>
[`user-links-${userId}`, limit], // ...他のキャッシュキー };

// キャッシュ更新サービス export const linkCacheService = {
updateAfterLinkAction: (userId: string, mutate: ScopedMutator): void => {
// 具体的なキャッシュキーを更新 mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));
mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId));
mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10));

    // 汎用的なキャッシュもクリア
    mutate(isLinkCache);

}, // ...他のメソッド };

// フックでの使用例 const { mutate } = useSWRConfig();

// リンクアクション後のキャッシュ更新 linkCacheService.updateAfterLinkAction(userId,
mutate);

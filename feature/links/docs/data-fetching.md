# SwipeScreen データ取得フロー

## 概要

SwipeScreenは、ユーザーがリンクをスワイプして分類するための画面です。このドキュメントでは、SwipeScreenでのデータ取得フローについて説明します。

## データフロー

```
SwipeScreen (Presentation)
    ↓
useSwipeScreenLinks (Application Hook)
    ↓
linkService.fetchSwipeableLinks (Application Service)
    ↓
linkApi.fetchUserLinks (Infrastructure API)
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
  isError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? ["swipeable-links", userId] : null,
    async () => {
      try {
        const result = await linkService.fetchSwipeableLinks(userId!, limit);
        return result;
      } catch (err) {
        console.error("Error in useSwipeScreenLinks:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    links: data || [],
    isError: error,
    isLoading,
    isEmpty: !data || data.length === 0,
  };
};
```

### 3. Application Layer (Services)

#### linkService.fetchSwipeableLinks (linkServices.ts)

- ビジネスロジックの実装
- APIからのデータ取得
- エラーハンドリング

```tsx
fetchSwipeableLinks: async (
  userId: string,
  limit: number = 20,
): Promise<UserLink[]> => {
  try {
    const links = await linkApi.fetchUserLinks({
      userId,
      limit,
      includeReadyToRead: true,
      orderBy: "link_updated_at",
      ascending: true,
    });

    return links;
  } catch (error) {
    console.error("Error fetching swipeable links:", error);
    throw error;
  }
};
```

### 4. Infrastructure Layer (API)

#### linkApi.fetchUserLinks (linkApi.ts)

- Supabaseとの通信
- クエリの構築
- エラーハンドリング

```tsx
fetchUserLinks: async (params: {
  userId: string;
  limit: number;
  status?: string;
  orderBy?: string;
  ascending?: boolean;
  includeReadyToRead?: boolean;
}) => {
  try {
    let query = supabase
      .from("user_links_with_actions")
      .select(
        `
        link_id,
        full_url,
        domain,
        parameter,
        link_created_at,
        link_updated_at,
        status,
        added_at,
        scheduled_read_at,
        read_at,
        read_count,
        swipe_count,
        user_id
      `,
      )
      .eq("user_id", params.userId);

    if (params.includeReadyToRead) {
      const now = new Date().toISOString();
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ).toISOString();
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      ).toISOString();

      query = query.or(
        `scheduled_read_at.is.null,and(scheduled_read_at.lt.${now},not.and(scheduled_read_at.gte.${startOfDay},scheduled_read_at.lt.${endOfDay}))`,
      );
    }

    if (params.status) {
      query = query.eq("status", params.status);
    }

    if (params.orderBy) {
      query = query.order(params.orderBy, { ascending: params.ascending });
    }

    const { data, error } = await query.limit(params.limit);

    if (error) {
      throw error;
    }

    return data as UserLink[];
  } catch (error) {
    console.error("Error fetching user links:", error);
    throw error;
  }
};
```

## データ取得条件

SwipeScreenでは、以下の条件を満たすリンクを取得します：

1. 指定されたユーザーID（`userId`）に関連するリンク
2. `scheduled_read_at`が以下のいずれかの条件を満たすリンク：
   - `null`である（スケジュールされていない）
   - 現在の日時より前である（スケジュール時間が過ぎている）
   - **今日の日付ではない**（今日の日付のものは除外）
3. `link_updated_at`の昇順で並べられたリンク（古いものから新しいものへ）
4. 最大20件のリンク

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
linkActionService.deleteLinkAction / updateLinkAction (Application Service)
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

  if (!userId || !linkId) {
    console.error("No linkId or userId in params");
    onClose();
    return;
  }

  try {
    // SelectedMarkをそのままStatusとして使用
    const status: LinkActionStatus = selectedMark;

    // swipeCountを数値に変換
    const swipeCountNum = swipeCount ? parseInt(swipeCount, 10) : 0;

    await updateLinkAction(userId, linkId, status, swipeCountNum);
    onClose();
  } catch (error) {
    console.error("Error in handleMarkAsRead:", error);
    onClose();
  }
};
```

### 2. Application Layer (Hooks)

#### useLinkAction (useLinkAction.ts)

- 削除・更新処理の状態管理（ローディング、エラー）
- サービス層の呼び出し
- 通知の表示
- キャッシュの更新

```tsx
// 削除処理
const deleteLinkAction = async (userId: string, linkId: string) => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await linkActionService.deleteLinkAction(userId, linkId);

    if (result.success) {
      // キャッシュの更新
      updateCacheAfterLinkAction(userId);

      // 成功通知
      notificationService.success("リンクが削除されました", undefined, {
        position: "top",
        offset: 70,
        duration: 3000,
      });
    } else {
      // エラー通知
      notificationService.error(
        "リンクの削除に失敗しました",
        result.error?.message || "不明なエラーが発生しました",
        { position: "top", offset: 70, duration: 3000 },
      );
    }

    return result;
  } catch (err) {
    // エラー処理
    setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    throw err;
  } finally {
    setIsLoading(false);
  }
};

// 更新処理
const updateLinkAction = async (
  userId: string,
  linkId: string,
  status: LinkActionStatus,
  swipeCount: number,
  read_at?: string | null,
) => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await linkActionService.updateLinkAction(
      userId,
      linkId,
      status,
      swipeCount,
      read_at,
    );

    if (result.success) {
      // キャッシュの更新
      updateCacheAfterLinkAction(userId);

      // 成功通知 - inMonth, inWeekend, Today の場合は表示しない
      const skipNotificationStatuses = ["inMonth", "inWeekend", "Today"];
      if (!skipNotificationStatuses.includes(status)) {
        notificationService.success(
          "リンクが更新されました",
          `ステータス: ${status}`,
          {
            position: "top",
            offset: 70,
            duration: 3000,
          },
        );
      }
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

// キャッシュ更新用のヘルパー関数
const updateCacheAfterLinkAction = (userId: string) => {
  // useTodaysLinksのキャッシュをクリア
  mutate(["today-links", userId]);

  // その他の関連するキャッシュもクリア
  mutate(["swipeable-links", userId]);
  mutate([`user-links-${userId}`, 10]); // デフォルトのlimit値を使用

  // 汎用的なキャッシュもクリア
  mutate(
    (key: unknown) =>
      Array.isArray(key) &&
      key.length > 0 &&
      typeof key[0] === "string" &&
      key[0].includes("links"),
  );
};
```

### 3. Application Layer (Services)

#### linkActionService.deleteLinkAction (linkActionService.ts)

- ビジネスロジックの実装
- APIの呼び出し
- エラーハンドリング

```tsx
async deleteLinkAction(
  userId: string,
  linkId: string,
): Promise<DeleteLinkActionResponse> {
  try {
    // APIの呼び出し
    const response = await linkActionsApi.deleteLinkAction({
      userId,
      linkId,
    });

    // レスポンスの検証
    if (!response.success) {
      console.error("Failed to delete link action:", {
        success: response.success,
        error: response.error,
        params: { userId, linkId },
      });
    }

    // 成功時の処理
    return response;
  } catch (error) {
    console.error("Error in linkActionService.deleteLinkAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error in service layer"),
    };
  }
}

// キャッシュ更新メソッド
updateCacheAfterDelete(
  userId: string,
  mutate: KeyedMutator<any>,
): void {
  // 関連するすべてのキャッシュを更新
  mutate(["today-links", userId]);
  mutate(["swipeable-links", userId]);
  mutate([`user-links-${userId}`, 10]);
  mutate((key) => Array.isArray(key) && key[0].includes("links"));
}
```

### 4. Infrastructure Layer (API)

#### linkActionsApi.deleteLinkAction (linkActionsApi.ts)

- Supabaseとの通信
- データベースからのレコード削除
- エラーハンドリング

```tsx
async deleteLinkAction(
  params: DeleteLinkActionParams,
): Promise<DeleteLinkActionResponse> {
  try {
    LinkActionsApi.validateDeleteParams(params);

    const { error } = await supabase
      .from("user_link_actions")
      .delete()
      .eq("link_id", params.linkId)
      .eq("user_id", params.userId);

    if (error) {
      console.error("Supabase error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        success: false,
        error: new Error(error.message),
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error in deleteLinkAction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}
```

## 通知サービスの統合

リンク削除機能では、統一された通知サービスを使用してユーザーにフィードバックを提供します：

```tsx
// 成功通知
notificationService.success("リンクが削除されました", undefined, {
  position: "top",
  offset: 70,
  duration: 3000,
});

// エラー通知
notificationService.error("リンクの削除に失敗しました", errorMessage, {
  position: "top",
  offset: 70,
  duration: 3000,
});
```

これにより、アプリケーション全体で一貫した通知スタイルを維持し、ユーザーエクスペリエンスを向上させています。

## キャッシュ更新戦略

リンクが削除された後、UIを最新の状態に保つために、関連するSWRキャッシュを更新します。この処理は`linkActionService.updateCacheAfterDelete`メソッドに集約されています：

```tsx
updateCacheAfterDelete(
  userId: string,
  mutate: KeyedMutator<any>,
): void {
  // 関連するすべてのキャッシュを更新
  mutate(["today-links", userId]);
  mutate(["swipeable-links", userId]);
  mutate([`user-links-${userId}`, 10]);
  mutate((key) => Array.isArray(key) && key[0].includes("links"));
}
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

## 今後の改善点

1. 削除前の確認ダイアログの追加
2. 削除の取り消し機能（Undo）の実装
3. 一括削除機能の追加
4. 削除理由の記録（オプション）
5. オフライン時の削除キューの実装

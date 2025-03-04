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
linkActionService.deleteLinkAction (Application Service)
    ↓
linkActionsApi.deleteLinkAction (Infrastructure API)
    ↓
Supabase (Database)
    ↓
SWR Cache Invalidation
    ↓
UI Update
```

## 各レイヤーの役割

### 1. Presentation Layer (LinkActionView.tsx)

- ユーザーインターフェースの表示
- 削除ボタンの提供
- 削除成功/失敗時のToast通知
- SWRキャッシュの更新

```tsx
const handleDelete = async () => {
  const { userId, linkId } = params;

  if (!userId || !linkId) {
    console.error("No linkId or userId in params");
    onClose();
    return;
  }

  try {
    const result = await deleteLinkAction(userId, linkId);
    if (result.success) {
      // SWRのキャッシュをクリア
      mutate(["today-links", userId]);
      mutate(["swipeable-links", userId]);
      mutate([`user-links-${userId}`, 10]);
      mutate((key) => Array.isArray(key) && key[0].includes("links"));

      // 成功時のToastを表示
      Toast.show({
        text1: "リンクが削除されました",
        type: "success",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    } else {
      // エラー時のToastを表示
      Toast.show({
        text1: "リンクの削除に失敗しました",
        text2: result.error?.message || "不明なエラーが発生しました",
        type: "error",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    }
  } catch (error) {
    // 例外発生時のToastを表示
    Toast.show({
      text1: "リンクの削除に失敗しました",
      text2:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
      type: "error",
      position: "top",
      topOffset: 70,
      visibilityTime: 3000,
    });
  } finally {
    onClose();
  }
};
```

### 2. Application Layer (Hooks)

#### useLinkAction (useLinkAction.ts)

- 削除処理の状態管理（ローディング、エラー）
- サービス層の呼び出し

```tsx
const deleteLinkAction = async (userId: string, linkId: string) => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await linkActionService.deleteLinkAction(userId, linkId);
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

## SWRキャッシュの更新

リンクが削除された後、UIを最新の状態に保つために、関連するSWRキャッシュを更新します。以下のキャッシュが更新されます：

1. `["today-links", userId]` - 今日読むリンクのキャッシュ
2. `["swipeable-links", userId]` - スワイプ可能なリンクのキャッシュ
3. `[user-links-${userId}, 10]` - ユーザーリンクのキャッシュ
4. その他の"links"を含むすべてのキャッシュ

これにより、削除されたリンクがUIから即座に消えるようになります。

## ユーザーフィードバック

リンク削除の結果に応じて、以下のToast通知が表示されます：

1. **成功時**:

   - メッセージ: "リンクが削除されました"
   - タイプ: success（緑色）

2. **失敗時**:
   - メッセージ: "リンクの削除に失敗しました"
   - サブメッセージ: エラーの詳細（利用可能な場合）
   - タイプ: error（赤色）

## エラーハンドリング

各レイヤーでエラーハンドリングを行い、エラーが発生した場合は上位レイヤーにエラーを伝播させます。最終的にユーザーにToast通知でエラーを表示します。

## 注意点

1. URLパラメータから`userId`と`linkId`を取得するため、これらのパラメータが存在しない場合は処理を中断します
2. 削除処理は非同期で行われ、処理中はボタンのローディング状態が表示されます
3. 削除が完了すると、モーダルは自動的に閉じられます
4. SWRキャッシュの更新により、リストビューが自動的に更新されます

## 今後の改善点

1. 削除前の確認ダイアログの追加
2. 削除の取り消し機能（Undo）の実装
3. 一括削除機能の追加
4. 削除理由の記録（オプション）

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
      orderBy: "added_at",
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
      query = query.or(
        "scheduled_read_at.is.null,and(scheduled_read_at.lt.now())",
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
3. `added_at`の昇順で並べられたリンク（古いものから新しいものへ）
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

## 今後の改善点

1. より詳細なエラーメッセージの表示
2. リトライ機能の実装
3. オフライン対応の強化
4. パフォーマンス最適化（必要に応じて）

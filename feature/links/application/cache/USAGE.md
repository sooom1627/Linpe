# キャッシュ中央管理システム - 使用ガイド

このドキュメントでは、Linpeアプリケーションのキャッシュ中央管理システムの詳細な使用方法について説明します。

## 目次

1. [基本的な使用方法](#基本的な使用方法)
2. [ユースケース別ガイド](#ユースケース別ガイド)
3. [パターンマッチングの活用](#パターンマッチングの活用)
4. [キャッシュキーの設計](#キャッシュキーの設計)
5. [トラブルシューティング](#トラブルシューティング)
6. [パフォーマンス最適化](#パフォーマンス最適化)

## 基本的な使用方法

### インポート

```typescript
// 必要なモジュールをインポート
import { useSWRConfig } from "swr";

import {
  LINK_CACHE_KEYS,
  linkCacheService,
} from "@/feature/links/application/cache";
```

### キャッシュキーの使用

```typescript
// SWRフックでのキャッシュキーの使用
const { data: todayLinks } = useSWR(LINK_CACHE_KEYS.TODAY_LINKS(userId), () =>
  linkService.fetchTodayLinks(userId),
);

// スワイプ可能なリンクの取得
const { data: swipeableLinks } = useSWR(
  LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId),
  () => linkService.fetchSwipeableLinks(userId),
);

// ユーザーリンクの取得（制限付き）
const { data: userLinks } = useSWR(LINK_CACHE_KEYS.USER_LINKS(userId, 20), () =>
  linkService.fetchUserLinks({ userId, limit: 20 }),
);
```

### キャッシュ更新

```typescript
// SWRのmutate関数を取得
const { mutate } = useSWRConfig();

// リンクアクション後のキャッシュ更新
const handleLinkAction = async () => {
  // リンクアクションの処理...
  const result = await linkActionService.updateLinkAction(
    userId,
    linkId,
    status,
  );

  if (result.success) {
    // キャッシュ更新
    linkCacheService.updateAfterLinkAction(userId, mutate);

    // 成功通知
    notificationService.success("リンクが更新されました");
  }
};

// リンク追加後のキャッシュ更新
const handleAddLink = async () => {
  // リンク追加の処理...
  const result = await linkService.addLinkAndUser(url, userId);

  if (result.status === "registered") {
    // キャッシュ更新
    linkCacheService.updateAfterLinkAdd(userId, mutate);

    // 成功通知
    notificationService.success("リンクが追加されました");
  }
};
```

## ユースケース別ガイド

### リンク削除後のキャッシュ更新

```typescript
const deleteLinkAction = async (userId: string, linkId: string) => {
  try {
    // 削除処理
    const result = await linkActionService.deleteLinkAction(userId, linkId);

    if (result.success) {
      // キャッシュ更新
      linkCacheService.updateAfterLinkAction(userId, mutate);

      // 成功通知
      notificationService.success("リンクが削除されました");
      return { success: true };
    } else {
      // エラー通知
      notificationService.error(
        "リンクの削除に失敗しました",
        result.error?.message,
      );
      return { success: false, error: result.error };
    }
  } catch (error) {
    // エラー通知
    notificationService.error("リンクの削除に失敗しました", error.message);
    return { success: false, error };
  }
};
```

### リンクステータス更新後のキャッシュ更新

```typescript
const updateLinkStatus = async (
  userId: string,
  linkId: string,
  status: LinkActionStatus,
) => {
  try {
    // ステータス更新処理
    const result = await linkActionService.updateLinkAction(
      userId,
      linkId,
      status,
    );

    if (result.success) {
      // キャッシュ更新
      linkCacheService.updateAfterLinkAction(userId, mutate);

      // 成功通知
      notificationService.success(
        "リンクのステータスが更新されました",
        `ステータス: ${status}`,
      );
      return { success: true, data: result.data };
    } else {
      // エラー通知
      notificationService.error(
        "リンクのステータス更新に失敗しました",
        result.error?.message,
      );
      return { success: false, error: result.error };
    }
  } catch (error) {
    // エラー通知
    notificationService.error(
      "リンクのステータス更新に失敗しました",
      error.message,
    );
    return { success: false, error };
  }
};
```

### OGデータ取得後のキャッシュ更新

```typescript
const fetchOGData = async (url: string) => {
  try {
    // OGデータ取得
    const ogData = await ogApi.fetchOGData(url);

    // URLをキーとしてキャッシュ更新
    const urlsKey = encodeURIComponent(url);
    linkCacheService.updateOGData(urlsKey, mutate);

    return ogData;
  } catch (error) {
    console.error("OGデータの取得に失敗しました", error);
    return null;
  }
};
```

## パターンマッチングの活用

### 複数のキャッシュを一度に更新

```typescript
// リンク関連の全てのキャッシュを更新
mutate(isLinkCache);

// links-で始まる全てのキャッシュを更新
mutate(isLinksStartsWithCache);
```

### カスタムパターンマッチング関数の作成

```typescript
// 特定のユーザーに関連する全てのキャッシュを更新するパターンマッチング関数
const isUserRelatedCache = (key: unknown, userId: string): boolean => {
  if (Array.isArray(key) && key.length > 1 && key[1] === userId) {
    return true;
  }
  return false;
};

// 使用例
mutate((key) => isUserRelatedCache(key, userId));
```

## キャッシュキーの設計

### 新しいキャッシュキーの追加

新しいキャッシュキーが必要な場合は、`linkCacheKeys.ts`に追加してください。

```typescript
// linkCacheKeys.tsに追加
export const LINK_CACHE_KEYS = {
  // 既存のキャッシュキー...

  // 新しいキャッシュキー
  ARCHIVED_LINKS: (userId: string) => ["archived-links", userId],

  // パラメータ付きのキャッシュキー
  FILTERED_LINKS: (userId: string, filter: string) => [
    "filtered-links",
    userId,
    filter,
  ],
};
```

### キャッシュキーの命名規則

キャッシュキーの命名規則は以下の通りです：

1. キャッシュキー定数は大文字のスネークケースで定義する（例：`TODAY_LINKS`）
2. キャッシュキー配列の最初の要素は小文字のケバブケースで定義する（例：`["today-links", userId]`）
3. リンク関連のキャッシュキーには"links"を含める

## トラブルシューティング

### キャッシュが更新されない場合

1. 正しいキャッシュキーを使用しているか確認する
2. `mutate`関数が正しく呼び出されているか確認する
3. パターンマッチング関数が正しく実装されているか確認する

```typescript
// デバッグ用のログ出力
console.log("キャッシュキー:", LINK_CACHE_KEYS.TODAY_LINKS(userId));
console.log("mutate関数:", mutate);

// 明示的にキャッシュを更新
mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));
```

### キャッシュの競合が発生する場合

1. キャッシュキーの一意性を確認する
2. キャッシュ更新の順序を確認する

```typescript
// 順序を明示的に制御
const updateCaches = async () => {
  // 最初に特定のキャッシュを更新
  await mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));

  // 次に別のキャッシュを更新
  await mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId));

  // 最後に汎用的なキャッシュを更新
  await mutate(isLinkCache);
};
```

## パフォーマンス最適化

### 必要なキャッシュのみを更新

パフォーマンスを最適化するために、必要なキャッシュのみを更新することを推奨します。

```typescript
// 良い例：必要なキャッシュのみを更新
const updateSpecificCaches = (userId: string) => {
  // 今日のリンクのキャッシュのみを更新
  mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));
};

// 避けるべき例：全てのキャッシュを更新
const updateAllCaches = () => {
  // 全てのキャッシュを更新（パフォーマンスに影響する可能性あり）
  mutate(isLinkCache);
};
```

### バッチ更新の活用

複数のキャッシュを更新する場合は、バッチ更新を活用することを推奨します。

```typescript
// バッチ更新の例
const batchUpdateCaches = async (userId: string) => {
  // 複数のキャッシュを一度に更新
  const promises = [
    mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId)),
    mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId)),
    mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10)),
  ];

  // 全ての更新が完了するのを待つ
  await Promise.all(promises);

  console.log("全てのキャッシュが更新されました");
};
```

### 条件付きキャッシュ更新

条件に基づいてキャッシュを更新することで、不要なキャッシュ更新を避けることができます。

```typescript
// 条件付きキャッシュ更新の例
const conditionalUpdateCaches = (userId: string, status: LinkActionStatus) => {
  // 今日のリンクのキャッシュを更新
  mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));

  // ステータスがReadの場合のみスワイプ可能なリンクのキャッシュを更新
  if (status === "Read") {
    mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId));
  }

  // ステータスがBookmarkの場合のみユーザーリンクのキャッシュを更新
  if (status === "Bookmark") {
    mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10));
  }
};
```

### キャッシュ期間の調整

データの種類に応じて、適切なキャッシュ期間を設定することが重要です。

```typescript
// 短期キャッシュ（頻繁に変更されるデータ）
const { data } = useSWR(
  LINK_CACHE_KEYS.TODAY_LINKS(userId),
  () => linkService.fetchTodayLinks(userId),
  {
    dedupingInterval: 60 * 1000, // 1分間
  },
);

// 中期キャッシュ（一般的なデータ）
const { data } = useSWR(
  LINK_CACHE_KEYS.USER_LINKS(userId),
  () => linkService.fetchUserLinks(userId),
  {
    dedupingInterval: 3600 * 1000, // 1時間
  },
);

// 長期キャッシュ（ほとんど変更されないデータ）
const { data } = useSWR(LINK_CACHE_KEYS.OG_DATA(url), () => fetchOGData(url), {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false,
  dedupingInterval: 30 * 24 * 3600 * 1000, // 30日間
});
```

### OGデータの長期キャッシュ戦略

OGデータは変更頻度が非常に低いため、特別な長期キャッシュ戦略を採用しています：

1. **二重キャッシュ**:

   - AsyncStorage: 30日間のキャッシュ
   - SWR: 30日間のメモリキャッシュ

2. **再検証の抑制**:

   - `revalidateIfStale: false`: 古いデータの自動再検証を無効化
   - `revalidateOnFocus: false`: フォーカス時の再検証を無効化
   - `revalidateOnReconnect: false`: 再接続時の再検証を無効化

3. **コンポーネントの最適化**:
   - React.memoを使用してコンポーネントをメモ化
   - 安定したIDを使用してカード生成を最適化

```typescript
// OGデータの取得（単一URL）
const { ogData, isLoading, isError } = useOGData(url);

// OGデータの一括取得（複数URL）
const { dataMap, loading, error } = useOGDataBatch(urls);
```

### 画像キャッシュの最適化

OGデータに含まれる画像のキャッシュも最適化するために、expo-imageライブラリを使用しています。

#### インストール

```bash
npx expo install expo-image
```

#### 基本的な使用方法

```typescript
import { Image } from 'expo-image';

// 基本的な使用例
const CardImage = ({ uri, title }) => (
  <Image
    source={{ uri }}
    cachePolicy="memory-disk"
    contentFit="cover"
    transition={200}
    accessible={true}
    accessibilityLabel={`${title} image`}
    style={{ width: '100%', aspectRatio: 1.91/1, borderRadius: 8 }}
  />
);
```

#### キャッシュポリシーの選択

expo-imageでは、以下のキャッシュポリシーを選択できます：

```typescript
// メモリのみにキャッシュ（アプリ終了時にクリア）
<Image
  source={{ uri }}
  cachePolicy="memory"
  // ...
/>

// ディスクのみにキャッシュ（永続的）
<Image
  source={{ uri }}
  cachePolicy="disk"
  // ...
/>

// メモリとディスクの両方にキャッシュ（推奨）
<Image
  source={{ uri }}
  cachePolicy="memory-disk"
  // ...
/>

// キャッシュなし
<Image
  source={{ uri }}
  cachePolicy="none"
  // ...
/>
```

#### キャッシュの管理

長期間使用するアプリケーションでは、定期的にキャッシュをクリアすることが重要です：

```typescript
import { clearImageCache } from 'expo-image';

// すべての画像キャッシュをクリア
const clearCache = async () => {
  try {
    await clearImageCache();
    console.log('画像キャッシュをクリアしました');
  } catch (error) {
    console.error('キャッシュクリアエラー:', error);
  }
};

// 設定画面などでユーザーに提供するオプション
const SettingsScreen = () => (
  <View>
    <Button title="画像キャッシュをクリア" onPress={clearCache} />
  </View>
);
```

#### パフォーマンスの最適化

画像キャッシュを最大限に活用するためのベストプラクティス：

1. **適切なキャッシュポリシーの選択**:

   - 頻繁に表示される画像には `memory-disk` を使用
   - 一時的な画像には `memory` を使用

2. **プレースホルダーの使用**:

   - 画像読み込み中にプレースホルダーを表示

   ```typescript
   <Image
     source={{ uri }}
     placeholder={{ uri: 'https://example.com/placeholder.jpg' }}
     // または
     placeholder={{ color: '#CCCCCC' }}
     // ...
   />
   ```

3. **エラーハンドリング**:

   - 画像読み込みエラー時の代替表示を実装

   ```typescript
   const [hasError, setHasError] = useState(false);

   return hasError ? (
     <View style={{ backgroundColor: '#F0F0F0', aspectRatio: 1.91/1 }}>
       <Text>画像を読み込めませんでした</Text>
     </View>
   ) : (
     <Image
       source={{ uri }}
       onError={() => setHasError(true)}
       // ...
     />
   );
   ```

4. **画像サイズの最適化**:
   - 表示サイズに合わせた画像を使用
   - WebPなどの効率的なフォーマットを優先

### キャッシュの無効化

```typescript
// キャッシュの無効化の例
const invalidateCaches = (userId: string) => {
  // 今日のリンクのキャッシュを無効化
  mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId), null);

  // スワイプ可能なリンクのキャッシュを無効化
  mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId), null);

  // ユーザーリンクのキャッシュを無効化
  mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10), null);
};
```

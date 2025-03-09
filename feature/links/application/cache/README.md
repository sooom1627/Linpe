# キャッシュ中央管理システム

このディレクトリには、Linpeアプリケーションのリンク機能におけるキャッシュ管理システムが含まれています。

## 概要

キャッシュ中央管理システムは、SWRを使用したデータフェッチングにおけるキャッシュの一貫性を保つために設計されています。このシステムは以下の2つの主要コンポーネントで構成されています：

1. **linkCacheKeys**: キャッシュキーの定義と判定関数
2. **linkCacheService**: キャッシュ更新ロジック

## キャッシュキー (linkCacheKeys.ts)

`linkCacheKeys.ts`は、アプリケーション全体で使用されるキャッシュキーを一元管理します。これにより、キャッシュキーの一貫性が保たれ、キャッシュの衝突や重複を防ぎます。

### 主要なキャッシュキー

```typescript
export const LINK_CACHE_KEYS = {
  // 今日のリンク用キャッシュキー
  TODAY_LINKS: (userId: string) => ["today-links", userId],

  // スワイプ可能なリンク用キャッシュキー
  SWIPEABLE_LINKS: (userId: string) => ["swipeable-links", userId],

  // ユーザーリンク用キャッシュキー
  USER_LINKS: (userId: string, limit: number = 10) => [
    `user-links-${userId}`,
    limit,
  ],

  // 汎用リンク用キャッシュキー
  LINKS: (limit: number) => ["links", limit],

  // OGデータ用キャッシュキー
  OG_DATA: (urlsKey: string) => ["og-data", urlsKey],
};
```

### パターンマッチング関数

キャッシュキーのパターンマッチングを行うための関数も提供されています：

```typescript
// リンク関連のキャッシュかどうかを判定する関数
export const isLinkCache = (key: unknown): boolean => {
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0].includes("links");
  }
  return false;
};

// links-で始まるキャッシュかどうかを判定する関数
export const isLinksStartsWithCache = (key: unknown): boolean => {
  if (typeof key === "string") {
    return key.startsWith("links-");
  }
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0].startsWith("links-");
  }
  return false;
};
```

## キャッシュサービス (linkCacheService.ts)

`linkCacheService.ts`は、キャッシュ更新ロジックを集約したサービスです。このサービスを使用することで、キャッシュ更新の一貫性が保たれ、コードの重複を防ぎます。

### 主要なメソッド

```typescript
export const linkCacheService = {
  // リンクアクション（更新・削除）後のキャッシュ更新
  updateAfterLinkAction: (userId: string, mutate: ScopedMutator): void => {
    // 具体的なキャッシュキーを更新
    mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));
    mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId));
    mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10));

    // 汎用的なキャッシュもクリア
    mutate(isLinkCache);
  },

  // リンク追加後のキャッシュ更新
  updateAfterLinkAdd: (userId: string, mutate: ScopedMutator): void => {
    // リンク追加後は全てのリンク関連キャッシュを更新
    mutate(isLinksStartsWithCache);
  },

  // OGデータのキャッシュ更新
  updateOGData: function <T>(urlsKey: string, mutate: KeyedMutator<T>): void {
    mutate();
  },
};
```

## 使用方法

### フックでの使用例

```typescript
import { useSWRConfig } from "swr";

import { linkCacheService } from "@/feature/links/application/cache";

// フック内での使用例
const { mutate } = useSWRConfig();

// リンクアクション後のキャッシュ更新
const handleLinkAction = async () => {
  // リンクアクションの処理...

  // キャッシュ更新
  linkCacheService.updateAfterLinkAction(userId, mutate);
};

// リンク追加後のキャッシュ更新
const handleAddLink = async () => {
  // リンク追加の処理...

  // キャッシュ更新
  linkCacheService.updateAfterLinkAdd(userId, mutate);
};
```

### サービスでの使用例

```typescript
import {
  LINK_CACHE_KEYS,
  linkCacheService,
} from "@/feature/links/application/cache";

// サービス内での使用例
export const linkActionService = {
  deleteLinkAction: async (userId: string, linkId: string) => {
    // 削除処理...

    return {
      success: true,
      error: null,
    };
  },

  // 削除後のキャッシュ更新（レガシーメソッド - 非推奨）
  updateCacheAfterDelete: (userId: string, mutate: KeyedMutator<any>): void => {
    // 代わりにlinkCacheServiceを使用することを推奨
    linkCacheService.updateAfterLinkAction(userId, mutate);
  },
};
```

## ベストプラクティス

1. **キャッシュキーの一貫性**

   - 常に`LINK_CACHE_KEYS`からキャッシュキーを取得し、ハードコードしないでください。
   - 新しいキャッシュキーが必要な場合は、`LINK_CACHE_KEYS`に追加してください。

2. **キャッシュ更新の集約**

   - キャッシュ更新ロジックは`linkCacheService`に集約してください。
   - 個別のコンポーネントやフックで独自のキャッシュ更新ロジックを実装しないでください。

3. **パターンマッチングの活用**

   - 複数のキャッシュを一度に更新する場合は、パターンマッチング関数を活用してください。
   - 特定のキャッシュのみを更新する場合は、具体的なキャッシュキーを使用してください。

4. **テスト**
   - キャッシュキーとキャッシュサービスのテストを作成し、正しく動作することを確認してください。
   - モックを使用して、`mutate`関数が正しいキャッシュキーで呼び出されることをテストしてください。

## 注意点

1. **過剰なキャッシュ更新の回避**

   - 必要なキャッシュのみを更新し、不要なキャッシュ更新を避けてください。
   - パターンマッチングは便利ですが、過剰なキャッシュ更新を引き起こす可能性があります。

2. **キャッシュキーの命名規則**

   - キャッシュキーは一貫した命名規則に従ってください。
   - リンク関連のキャッシュキーには"links"を含めてください。

3. **レガシーコードとの互換性**
   - レガシーコードでは、個別のキャッシュ更新ロジックが実装されている場合があります。
   - 可能な限り、これらのコードを`linkCacheService`を使用するように更新してください。

## 今後の改善点

1. **キャッシュの有効期限設定**

   - キャッシュの有効期限を設定する機能の追加
   - 長期間使用されていないキャッシュの自動クリア

2. **キャッシュの依存関係管理**

   - キャッシュ間の依存関係を明示的に定義する機能
   - 依存関係に基づいた効率的なキャッシュ更新

3. **キャッシュのデバッグ機能**

   - 開発環境でのキャッシュ状態の可視化
   - キャッシュ更新のログ記録

4. **オフラインサポートの強化**
   - オフライン時のキャッシュ戦略の改善
   - オフライン時の変更の追跡と同期

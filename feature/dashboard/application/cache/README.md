# feature/dashboard/application/cache

## 概要

ダッシュボード機能で使用されるキャッシュを管理するモジュールです。SWRのキャッシュキーやキャッシュ更新の仕組みを提供します。

## コンポーネント

### actionLogCacheKeys

アクションログに関連するキャッシュキーを一元管理する定数と判定関数を提供します。

```typescript
import { ACTION_LOG_CACHE_KEYS, isActionLogCache } from "./actionLogCacheKeys";

// キャッシュキーの使用例
const cacheKey = ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId);

// キャッシュキーの判定関数の使用例
mutate(isActionLogCache);
```

主なキャッシュキー：

- `TODAY_ACTION_LOG_COUNT`: 今日のアクションログカウント
- `PERIOD_ACTION_LOG_COUNT`: 期間指定のアクションログカウント
- `ACTION_TYPE_COUNT`: 特定のアクションタイプのカウント
- `LINK_STATUS_COUNTS`: リンクステータスカウント
- `SWIPE_STATUS_COUNTS`: スワイプステータスカウント

### actionLogCacheService

アクションログ関連のキャッシュを管理するサービスを提供します。

```typescript
import { actionLogCacheService } from "./actionLogCacheService";

// キャッシュ更新の例
actionLogCacheService.updateAfterActionLogAdd(userId, mutate);
```

主な機能：

- `updateAfterActionLogCount`: アクションログカウント取得後のキャッシュ更新
- `updateAfterActionLogAdd`: アクションログ追加後のキャッシュ更新
  - 今日のアクションログカウント
  - リンクステータスカウント
  - スワイプステータスカウント
  - その他のアクションログ関連キャッシュ（isActionLogCacheに一致するもの）
- `updateActionTypeCount`: 特定のアクションタイプのカウントキャッシュ更新

### weeklyActivityCacheKeys

週間アクティビティに関連するキャッシュキーを一元管理する定数と判定関数を提供します。

```typescript
import { WEEKLY_ACTIVITY_CACHE_KEYS, isWeeklyActivityCache } from "./weeklyActivityCacheKeys";

// キャッシュキーの使用例
const cacheKey = WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(userId);

// キャッシュキーの判定関数の使用例
mutate(isWeeklyActivityCache);
```

主なキャッシュキー：

- `WEEKLY_ACTIVITY`: 週間アクティビティデータ

### weeklyActivityCacheService

週間アクティビティ関連のキャッシュを管理するサービスを提供します。

```typescript
import { weeklyActivityCacheService } from "./weeklyActivityCacheService";

// キャッシュ更新の例
weeklyActivityCacheService.updateAfterActionLogChange(userId, mutate);
```

主な機能：

- `updateAfterWeeklyActivityFetch`: 週間アクティビティデータ取得後のキャッシュ更新
- `updateAfterActionLogChange`: アクションログ変更後の週間アクティビティキャッシュ更新
- `updateWeeklyActivity`: 特定の週間アクティビティキャッシュの更新

### swrConfig

SWRの共通設定を提供します。

```typescript
import { SWR_DEFAULT_CONFIG, SWR_DISPLAY_CONFIG } from "./swrConfig";

// SWRの使用例
const { data } = useSWR(cacheKey, fetcher, SWR_DEFAULT_CONFIG);
```

主な設定：

- `SWR_DEFAULT_CONFIG`: デフォルト設定（バックグラウンド更新あり）
- `SWR_DISPLAY_CONFIG`: データ表示用の設定（バックグラウンド更新なし）

## フィーチャー間の連携

他のフィーチャーとの連携は、`shared/cache/crossFeatureCacheService`を通じて行います。このサービスは各フィーチャーのキャッシュサービスのオーケストレーターとして機能し、フィーチャー間の責任分担を明確にします。

具体的には：

- `actionLogCacheService`は自身のドメイン（アクションログ関連）のキャッシュ操作に責任を持ちます
- `weeklyActivityCacheService`は自身のドメイン（週間アクティビティ関連）のキャッシュ操作に責任を持ちます
- `actionLogCacheUpdateService`は複数のキャッシュサービスを横断した更新を担当します
- `crossFeatureCacheService`は複数のフィーチャーにまたがるキャッシュ更新を調整します

詳細は[shared/cache/README.md](../../../../shared/cache/README.md)を参照してください。

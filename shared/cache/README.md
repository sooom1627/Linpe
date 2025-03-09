# shared/cache

## crossFeatureCacheService

フィーチャー間のキャッシュ連携を最小限に管理するサービスです。現在は、リンク関連のアクション後にダッシュボードのキャッシュを更新する機能のみを提供しています。

### 使用方法

```typescript
import { crossFeatureCacheService } from "@/shared/cache/crossFeatureCacheService";

// リンクアクション後にダッシュボードキャッシュを更新
crossFeatureCacheService.updateDashboardCacheAfterLinkAction(userId, mutate);
```

### 提供する機能

- `updateDashboardCacheAfterLinkAction`: リンク関連アクション後にダッシュボードのアクションログキャッシュを更新します

### 注意事項

- このサービスは、フィーチャー間の連携が必要な場合のみ使用してください
- 各フィーチャー内のキャッシュ管理は、そのフィーチャー内のキャッシュサービスを使用してください
- 必要最小限の連携のみを実装しています

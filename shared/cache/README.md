# shared/cache

## crossFeatureCacheService

フィーチャー間のキャッシュ連携を管理するサービスです。複数のフィーチャーにまたがるキャッシュ更新のオーケストレーションを行い、各フィーチャー固有のキャッシュサービスに処理を委譲します。

### 使用方法

```typescript
import { crossFeatureCacheService } from "@/shared/cache/crossFeatureCacheService";

// リンクアクション後にダッシュボードキャッシュを更新
crossFeatureCacheService.updateDashboardCacheAfterLinkAction(userId, mutate);
```

### 提供する機能

- `updateDashboardCacheAfterLinkAction`: リンク関連アクション後にダッシュボードのキャッシュ更新をオーケストレーションします
  - アクションログキャッシュの更新処理を
    `actionLogCacheService.updateAfterActionLogAdd` に委譲します
  - 将来的に他のフィーチャーのキャッシュ更新が必要になった場合、このメソッド内で調整します

### 設計原則

- **責任の分離**: 各フィーチャー固有のキャッシュ操作は、それぞれのフィーチャーのキャッシュサービスが担当します
- **オーケストレーション**: このサービスは複数のフィーチャーにまたがるキャッシュ更新の調整役として機能します
- **最小限の依存関係**: 必要最小限のフィーチャー間連携のみを実装します

### 注意事項

- このサービスは、フィーチャー間の連携が必要な場合のみ使用してください
- 各フィーチャー内のキャッシュ管理は、そのフィーチャー内のキャッシュサービスを使用してください

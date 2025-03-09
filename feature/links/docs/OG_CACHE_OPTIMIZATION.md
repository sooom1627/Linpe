# OGデータキャッシュ最適化

このドキュメントでは、リンクプレビュー表示時のOGデータ再取得問題を解決するために実装した最適化について説明します。

## 問題の概要

リンクプレビューコンポーネント表示時に、キャッシュが効いていないため、毎回OGデータの再取得が発生していました。これにより、不要なネットワークリクエストが発生し、パフォーマンスが低下していました。

## 原因

1. **キャッシュキーの不一致**:

   - `useOGData`フックでは独自のキャッシュキー形式を使用していた
   - 中央管理されている`LINK_CACHE_KEYS.OG_DATA`と一致していなかった

2. **キャッシュ期間が短い**:

   - AsyncStorageとSWRのキャッシュ期間が1時間に設定されていた
   - OGデータは変更頻度が低いため、より長期間のキャッシュが適切

3. **コンポーネントの再レンダリング**:
   - `LinkPreview`コンポーネントが最適化されておらず、不要な再レンダリングが発生
   - `randomUUID()`の使用により、再レンダリング時に毎回新しいIDが生成されていた

## 実装した解決策

1. **キャッシュキーの統一**:

   ```typescript
   // 修正前
   const { data } = useSWR(url ? `og-data-${url}` : null, ...);

   // 修正後
   const { data } = useSWR(url ? LINK_CACHE_KEYS.OG_DATA(url) : null, ...);
   ```

2. **キャッシュ期間の延長**:

   ```typescript
   // 修正前
   const CACHE_DURATION_MS = 3600 * 1000; // 1時間

   // 修正後
   const CACHE_DURATION_MS = 30 * 24 * 3600 * 1000; // 30日間
   ```

3. **SWR設定の強化**:

   ```typescript
   // 修正前
   {
     revalidateOnFocus: false,
     revalidateOnReconnect: false,
   }

   // 修正後
   {
     revalidateOnFocus: false,
     revalidateOnReconnect: false,
     revalidateIfStale: false,
     dedupingInterval: 30 * 24 * 3600 * 1000, // 30日間
   }
   ```

4. **コンポーネントの最適化**:

   ```typescript
   // 修正前
   export const LinkPreview = ({ ... }) => { ... };

   // 修正後
   const LinkPreviewComponent = ({ ... }) => { ... };
   export const LinkPreview = React.memo(LinkPreviewComponent);
   ```

5. **安定したIDの使用**:

   ```typescript
   // 修正前
   const link_id = randomUUID();

   // 修正後
   const link_id = full_url;
   ```

## 期待される効果

1. **パフォーマンスの向上**:

   - 不要なネットワークリクエストの削減
   - 画面表示の高速化

2. **ユーザー体験の改善**:

   - リンクプレビューの即時表示
   - データ通信量の削減

3. **サーバー負荷の軽減**:
   - 外部サイトへのOG情報リクエスト回数の削減

## 注意点

1. **キャッシュの鮮度**:

   - OGデータは30日間キャッシュされるため、元のサイトのOG情報が変更された場合でも反映されない
   - 必要に応じて手動でキャッシュを無効化する機能を追加することも検討

2. **メモリ使用量**:
   - 長期間のSWRキャッシュはメモリ使用量を増加させる可能性がある
   - 必要に応じてキャッシュのクリーンアップ戦略を検討

## 関連ファイル

- `feature/links/application/hooks/og/useOGData.ts`
- `feature/links/application/hooks/og/useOGDataBatch.ts`
- `feature/links/application/service/ogService.ts`
- `feature/links/presentation/components/display/preview/LinkPreview.tsx`
- `feature/links/application/cache/README.md`
- `feature/links/application/cache/USAGE.md`

# ダッシュボード機能アーキテクチャ

このドキュメントでは、ダッシュボード機能のアーキテクチャについて説明します。

## アーキテクチャの概要

ダッシュボード機能は、クリーンアーキテクチャの原則に従って設計されています。以下の4つの層で構成されています：

1. **プレゼンテーション層**

   - ユーザーインターフェース
   - コンポーネント
   - ビューモデル

2. **アプリケーション層**

   - ユースケース
   - サービス
   - カスタムフック

3. **ドメイン層**

   - エンティティ
   - 値オブジェクト
   - ドメインサービス

4. **インフラストラクチャ層**
   - リポジトリ
   - 外部サービス
   - データベース

## 関数ベースアーキテクチャ

最近のリファクタリングでは、クラスベースの実装から関数ベースの実装に移行しました。この変更は以下の原則に基づいています：

1. **純粋関数の優先**

   - 副作用の最小化
   - 予測可能な動作
   - テストの容易性

2. **依存性の明示的な注入**

   - 関数の引数として依存関係を渡す
   - インターフェースの明確化
   - 結合度の低減

3. **状態管理の簡素化**
   - イミュータブルな状態
   - 単方向データフロー
   - 状態更新の追跡容易性

## 実装例：WeeklyActivity

### 1. ドメインモデル

```typescript
// domain/models/WeeklyActivity.ts
export interface WeeklyActivity {
  userId: string;
  activities: Array<{
    date: Date;
    readCount: number;
    swipeCount: number;
    addCount: number;
  }>;
}

export interface ActivityLog {
  changed_at: string;
  new_status: string;
}
```

### 2. リポジトリ

```typescript
// infrastructure/api/weeklyActivityApi.ts
export interface IWeeklyActivityRepository {
  fetchActivityLogs: (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => Promise<ActivityLog[]>;
}

export const weeklyActivityRepository: IWeeklyActivityRepository = {
  fetchActivityLogs: async (userId, startDate, endDate) => {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("changed_at", startDate.toISOString())
      .lte("changed_at", endDate.toISOString());

    if (error) throw new Error("Failed to fetch activity logs");
    return data;
  },
};
```

### 3. サービス

```typescript
// application/services/weeklyActivityService.ts
export const weeklyActivityService = {
  getWeeklyActivity: async (
    repository: IWeeklyActivityRepository,
    userId: string,
  ): Promise<WeeklyActivityViewModel> => {
    const endDate = new Date();
    const startDate = subDays(endDate, 6);

    const logs = await repository.fetchActivityLogs(userId, startDate, endDate);
    return transformToViewModel(logs);
  },

  transformToViewModel: (logs: ActivityLog[]): WeeklyActivityViewModel => {
    // ビューモデルへの変換ロジック
    return {
      activities: groupByDay(logs),
    };
  },
};
```

### 4. カスタムフック

```typescript
// application/hooks/useWeeklyActivity.ts
export const useWeeklyActivity = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useSWR(
    userId ? [CACHE_KEYS.WEEKLY_ACTIVITY, userId] : null,
    ([_, id]) =>
      weeklyActivityService.getWeeklyActivity(weeklyActivityRepository, id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000,
    },
  );
};
```

### 5. プレゼンテーション

```typescript
// presentation/components/WeeklyActivityView.tsx
export const WeeklyActivityView: React.FC = () => {
  const { data, error, isLoading } = useWeeklyActivity();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <div className="weekly-activity">
      <WeeklyActivityChart data={data.activities} />
      <WeeklyActivityStats data={data.activities} />
    </div>
  );
};
```

## アーキテクチャの利点

1. **テスト容易性**

   - 純粋関数のテスト
   - モックの容易な注入
   - 副作用の分離

2. **保守性**

   - 責務の明確な分離
   - コードの再利用性
   - 変更の影響範囲の限定

3. **スケーラビリティ**
   - 機能の追加容易性
   - パフォーマンスの最適化
   - 並行開発の容易性

## 依存関係の管理

1. **インターフェースの定義**

   - 明確な契約
   - 実装の詳細の隠蔽
   - テスト用モックの容易な作成

2. **依存性の注入**

   - 関数の引数として渡す
   - テスト時の差し替え容易性
   - 結合度の低減

3. **型安全性**
   - TypeScriptの活用
   - コンパイル時の型チェック
   - 実行時エラーの防止

## エラー処理

1. **エラーの種類**

   - インフラストラクチャエラー
   - ドメインエラー
   - バリデーションエラー

2. **エラーの伝播**

   - 適切な層でのキャッチ
   - エラーメッセージの変換
   - ユーザーフレンドリーな表示

3. **リカバリー**
   - 再試行メカニズム
   - フォールバック処理
   - グレースフルデグラデーション

## パフォーマンス

1. **データフェッチング**

   - キャッシュの活用
   - 必要最小限のデータ取得
   - バッチ処理の活用

2. **レンダリング**

   - メモ化の活用
   - 不要な再レンダリングの防止
   - コンポーネントの分割

3. **最適化**
   - バンドルサイズの最適化
   - コード分割
   - レイジーローディング

## セキュリティ

1. **認証・認可**

   - セッション管理
   - アクセス制御
   - CSRF対策

2. **データ保護**

   - 入力値のバリデーション
   - SQLインジェクション対策
   - XSS対策

3. **監査**
   - ログの記録
   - アクティビティの追跡
   - エラーの監視

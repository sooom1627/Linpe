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

## クラスベースから関数ベースへの移行

ダッシュボード機能では、クラスベースのアーキテクチャから関数ベースのアーキテクチャへの移行を進めています。この移行によって、以下の利点が得られます：

## 関数ベースアーキテクチャの原則

1. **純粋関数の活用**

   - 入力に対して同じ出力を返す
   - 副作用を最小限に抑える
   - テストが容易

2. **明示的な依存性注入**

   - 依存関係を引数として渡す
   - モックが容易
   - テストのセットアップが簡潔

3. **状態管理の簡素化**

   - ローカル状態の局所化
   - グローバル状態の分離
   - より予測可能な挙動

4. **コードの再利用性向上**
   - 小さな関数の組み合わせ
   - 共通ロジックの抽出
   - 高い凝集性と低い結合度

## 実装例: WeeklyActivity

### 変更前（クラスベース）

```typescript
// リポジトリクラス
class WeeklyActivityRepository implements IWeeklyActivityRepository {
  async fetchActivityLogs(userId: string, startDate: string, endDate: string) {
    // Supabaseからデータ取得
  }
}

// サービスクラス
class WeeklyActivityService {
  private repository: IWeeklyActivityRepository;

  constructor(repository: IWeeklyActivityRepository) {
    this.repository = repository;
  }

  async getWeeklyActivity(userId: string) {
    // リポジトリを使用してデータ取得
    const logs = await this.repository.fetchActivityLogs(
      userId,
      startDate,
      endDate,
    );
    // データ変換処理
    return transformedData;
  }
}

// フッククラス
function useWeeklyActivity() {
  const { session } = useSession();
  const userId = session?.user?.id;

  // インスタンス化
  const repository = new WeeklyActivityRepository();
  const service = new WeeklyActivityService(repository);

  const { data, error, isLoading } = useSWR(
    userId ? ["weekly-activity", userId] : null,
    () => service.getWeeklyActivity(userId),
  );

  return { data, error, isLoading };
}
```

### 変更後（関数ベース）

```typescript
// リポジトリオブジェクト
export const weeklyActivityRepository = {
  async fetchActivityLogs(userId: string, startDate: string, endDate: string) {
    // Supabaseからデータ取得
  },
};

// サービスオブジェクト
export const weeklyActivityService = {
  async getWeeklyActivity(userId: string) {
    const { startUTC, endUTC } = dateUtils.getDateRangeForFetch();
    // リポジトリを使用してデータ取得
    const logs = await weeklyActivityRepository.fetchActivityLogs(
      userId,
      startUTC,
      endUTC,
    );
    // データ変換処理
    return transformedData;
  },
};

// キャッシュキー定義
export const WEEKLY_ACTIVITY_CACHE_KEYS = {
  WEEKLY_ACTIVITY: (userId: string) =>
    userId ? ["weekly-activity", userId] : null,
};

// フック関数
export function useWeeklyActivity() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading } = useSWR(
    WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(userId),
    () => weeklyActivityService.getWeeklyActivity(userId),
    SWR_DEFAULT_CONFIG,
  );

  return { data, error, isLoading };
}
```

## DataFetchState コンポーネント

データフェッチング状態を統一的に管理するための新コンポーネントとして、`DataFetchState`
を追加しました。このコンポーネントは、ローディング状態とエラー状態の表示を一元管理します。

```tsx
interface DataFetchStateProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
}

export const DataFetchState: React.FC<DataFetchStateProps> = ({
  isLoading,
  error,
  children,
}) => {
  if (isLoading) {
    return <LoadingIndicator message="読み込み中..." />;
  }

  if (error) {
    return <ErrorDisplay message="データの取得に失敗しました" />;
  }

  return <>{children}</>;
};
```

### 使用例

```tsx
function WeeklyActivityChartView() {
  const { data, error, isLoading } = useWeeklyActivity();

  return (
    <DataFetchState isLoading={isLoading} error={error}>
      <WeeklyActivityChart data={data} />
    </DataFetchState>
  );
}
```

この実装によって、データフェッチの状態管理が統一され、コードの重複が削減され、一貫したユーザーエクスペリエンスが実現されています。

## ProgressBar コンポーネント

データの内訳を視覚的に表示するための汎用コンポーネントとして、`ProgressBar`を実装しました。このコンポーネントは、複数の項目の数値とその合計に対する比率をプログレスバーとして表示します。

```tsx
// 進捗データの型定義
export interface ProgressItem {
  id: string;
  title: string;
  value: number;
  color: string;
}

// 進捗バーのプロパティ
interface ProgressBarProps {
  title?: string;
  items: ProgressItem[];
  total: number;
  showLegend?: boolean;
}

export const ProgressBar = ({
  title,
  items,
  total,
  showLegend = true,
}: ProgressBarProps) => {
  // 合計値の計算
  const currentTotal = items.reduce((sum, item) => sum + item.value, 0);

  // 全体の進捗率（0〜100の範囲）
  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((currentTotal / total) * 100)),
  );

  // コンポーネントの実装...
};
```

## StatusOverview コンポーネント

StatusOverviewは、さまざまなステータスデータの概要を統一された方法で表示するための汎用コンポーネントです。内部でProgressBarとDataFetchStateを使用しています。

```tsx
interface StatusOverviewProps {
  title: string;
  items: ProgressItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
}

export const StatusOverview = ({
  title,
  items,
  total,
  isLoading,
  error,
}: StatusOverviewProps) => {
  return (
    <View className="w-full">
      <ThemedText
        text={title}
        variant="body"
        color="default"
        weight="semibold"
      />
      <DataFetchState isLoading={isLoading} error={error}>
        <View className="mt-4 flex-col items-start justify-between gap-3">
          <ProgressBar
            title={title}
            items={items}
            total={total}
            showLegend={true}
          />
        </View>
      </DataFetchState>
    </View>
  );
};
```

### 使用例

```tsx
// リンクステータスの概要表示
const LinksOverview = ({ userId }: OverviewProps) => {
  const { data: linkStatusData, isLoading, error } = useLinkStatusCount(userId);

  const getLinkProgressData = () => {
    // データ加工ロジック...
    return {
      total: linkStatusData.total,
      items: [
        {
          id: "read",
          title: "Read",
          value: linkStatusData.read,
          color: "#3F3F46",
        },
        // その他の項目...
      ],
    };
  };

  return (
    <StatusOverview
      title="Links Status"
      items={getLinkProgressData().items}
      total={getLinkProgressData().total}
      isLoading={isLoading}
      error={error}
    />
  );
};
```

これらのコンポーネントにより、異なる種類のデータでも一貫した方法で視覚化できるようになり、UIの統一性と再利用性が向上しました。

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

import { View } from "react-native";
import { ChartNoAxesGantt } from "lucide-react-native";

import { ThemedText } from "@/components/text/ThemedText";
import {
  useLinkStatusCount,
  useSwipeStatusCount,
} from "@/feature/dashboard/application/hooks";
import { type ProgressItem } from "../components/display/charts/ProgressBar";
import { colors } from "../components/display/constants/colors";
import { StatusOverview } from "../components/display/overview";

/**
 * 共通のステータスマッピングロジック
 * データとカラーテーマからProgressItemを生成する
 */
export function createProgressItems<T>(
  data: T,
  itemsConfig: Array<{
    id: Extract<keyof T, string>;
    title: string;
    color: string;
  }>,
): ProgressItem[] {
  if (!data) return [];

  return itemsConfig
    .filter(({ id }) => data[id] !== undefined)
    .map(({ id, title, color }) => ({
      id: id,
      title,
      value: Number(data[id]),
      color,
    }));
}

/**
 * リンクステータスの概要データを取得する
 */
const useLinkOverviewData = (userId: string) => {
  const { data, isLoading, error } = useLinkStatusCount(userId);

  const getProgressData = () => {
    if (!data) {
      return {
        total: 0,
        items: [] as ProgressItem[],
      };
    }

    const itemsConfig = [
      {
        id: "read" as const,
        title: "Read",
        color: colors.add.main,
      },
      {
        id: "reread" as const,
        title: "Re-Read",
        color: colors.swipe.main,
      },
      {
        id: "bookmark" as const,
        title: "Bookmark",
        color: colors.read.main,
      },
    ];

    return {
      total: data.total,
      items: createProgressItems(data, itemsConfig),
    };
  };

  return {
    data: getProgressData(),
    isLoading,
    error,
  };
};

/**
 * スワイプステータスの概要データを取得する
 */
const useSwipeOverviewData = (userId: string) => {
  const { data, isLoading, error } = useSwipeStatusCount(userId);

  const getProgressData = () => {
    if (!data) {
      return {
        total: 0,
        items: [] as ProgressItem[],
      };
    }

    const itemsConfig = [
      {
        id: "today" as const,
        title: "Today",
        color: colors.add.main,
      },
      {
        id: "inWeekend" as const,
        title: "In Weekend",
        color: colors.swipe.main,
      },
      {
        id: "skip" as const,
        title: "Skip",
        color: colors.read.main,
      },
    ];

    return {
      total: data.total,
      items: createProgressItems(data, itemsConfig),
    };
  };

  return {
    data: getProgressData(),
    isLoading,
    error,
  };
};

/**
 * ProgressiveStatusBarコンポーネントの型定義
 */
export interface ProgressiveStatusBarProps {
  type: "links" | "swipe";
  userId: string;
  showLegend?: boolean;
  showPercentage?: boolean;
  equalSegments?: boolean;
}

/**
 * 進捗状況バーコンポーネント
 * type プロパティに基づいて、リンクまたはスワイプのステータス概要を表示
 */
export const ProgressiveStatusBar = ({
  type,
  userId,
  showLegend = true,
  showPercentage = true,
  equalSegments,
}: ProgressiveStatusBarProps) => {
  // Hooksを条件付きで呼び出さないように両方のデータを取得
  const linksData = useLinkOverviewData(userId);
  const swipeData = useSwipeOverviewData(userId);

  // typeに基づいて適切なデータを選択
  const overviewData = type === "links" ? linksData : swipeData;
  const title = type === "links" ? "Links Status" : "Swipe Actions";

  // スワイプアクションのステータス表示では、タイプに基づいてデフォルト値を設定
  const useEqualSegments =
    equalSegments !== undefined ? equalSegments : type === "swipe"; // swipeタイプの場合、デフォルトでequalSegmentsをtrue

  return (
    <StatusOverview
      title={title}
      items={overviewData.data.items}
      total={overviewData.data.total}
      isLoading={overviewData.isLoading}
      error={overviewData.error}
      showLegend={showLegend}
      showPercentage={showPercentage}
      equalSegments={useEqualSegments}
    />
  );
};

/**
 * Overviewコンポーネントの型定義
 */
export interface OverviewProps {
  userId: string;
}

/**
 * ステータス概要コンポーネント
 * リンクとスワイプの両方のステータスを表示する統合コンポーネント
 */
export const Overview = ({ userId }: OverviewProps) => {
  return (
    <View>
      <View className="mb-2 w-full flex-row items-start justify-start">
        <View className="flex-row items-start gap-2">
          <ChartNoAxesGantt size={16} color="#FA4714" strokeWidth={1.5} />
          <ThemedText
            text={"Status Overview"}
            variant="body"
            weight="semibold"
            color="default"
          />
        </View>
      </View>
      <ProgressiveStatusBar type="links" userId={userId} />
      <View className="h-3" />
      <ProgressiveStatusBar
        type="swipe"
        userId={userId}
        equalSegments={true}
        showPercentage={false}
      />
    </View>
  );
};

// 以下は後方互換性のためのコンポーネント

/**
 * リンクステータスの概要を表示するコンポーネント
 * @deprecated 代わりに `<ProgressiveStatusBar type="links" userId={userId} />` を使用してください
 */
export const LinksOverview = ({ userId }: { userId: string }) => {
  return <ProgressiveStatusBar type="links" userId={userId} />;
};

/**
 * スワイプステータスの概要を表示するコンポーネント
 * @deprecated 代わりに `<ProgressiveStatusBar type="swipe" userId={userId} />` を使用してください
 */
export const SwipeOverview = ({ userId }: { userId: string }) => {
  return (
    <ProgressiveStatusBar
      type="swipe"
      userId={userId}
      equalSegments={true}
      showPercentage={false}
    />
  );
};

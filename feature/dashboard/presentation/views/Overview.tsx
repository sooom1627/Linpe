import {
  useLinkStatusCount,
  useSwipeStatusCount,
} from "@/feature/dashboard/application/hooks";
import { type ProgressItem } from "../components/display/charts/ProgressBar";
import { StatusOverview } from "../components/display/overview";

interface OverviewProps {
  userId: string;
}

/**
 * リンクステータスの概要を表示するコンポーネント
 */
export const LinksOverview = ({ userId }: OverviewProps) => {
  const { data: linkStatusData, isLoading, error } = useLinkStatusCount(userId);

  // リンクステータスデータからProgressItem配列を生成
  const getLinkProgressData = () => {
    if (!linkStatusData) {
      return {
        total: 0,
        items: [] as ProgressItem[],
      };
    }

    return {
      total: linkStatusData.total,
      items: [
        {
          id: "read",
          title: "Read",
          value: linkStatusData.read,
          color: "#3F3F46", // zinc-700
        },
        {
          id: "reread",
          title: "Re-Read",
          value: linkStatusData.reread,
          color: "#71717A", // zinc-500
        },
        {
          id: "bookmark",
          title: "Bookmark",
          value: linkStatusData.bookmark,
          color: "#A1A1AA", // zinc-400
        },
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

/**
 * スワイプステータスの概要を表示するコンポーネント
 */
export const SwipeOverview = ({ userId }: OverviewProps) => {
  const {
    data: swipeStatusData,
    isLoading,
    error,
  } = useSwipeStatusCount(userId);

  // スワイプステータスデータからProgressItem配列を生成
  const getSwipeProgressData = () => {
    if (!swipeStatusData) {
      return {
        total: 0,
        items: [] as ProgressItem[],
      };
    }

    return {
      total: swipeStatusData.total,
      items: [
        {
          id: "today",
          title: "Today",
          value: swipeStatusData.today,
          color: "#3F3F46", // zinc-700
        },
        {
          id: "inWeekend",
          title: "In Weekend",
          value: swipeStatusData.inWeekend,
          color: "#71717A", // zinc-500
        },
        {
          id: "skip",
          title: "Skip",
          value: swipeStatusData.skip,
          color: "#A1A1AA", // zinc-400
        },
      ],
    };
  };

  return (
    <StatusOverview
      title="Swipe Actions"
      items={getSwipeProgressData().items}
      total={getSwipeProgressData().total}
      isLoading={isLoading}
      error={error}
    />
  );
};

import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useSession } from "@/feature/auth/application/hooks/useSession";
import { useLinkStatusCount } from "@/feature/dashboard/application/hooks";
import { LinkProgressBar } from "../components";
import { type ProgressItem } from "../components/display/charts/LinkProgressBar";
import { DataFetchState } from "../components/display/DataFetchState";
import { WeeklyActivityChartView } from "../views/WeeklyActivityChartView";

export const DashboardScreen = () => {
  const { session } = useSession();
  const userId = session?.user?.id || "";

  return (
    <View className="flex items-center justify-center gap-4 px-4 py-5">
      {/* スクリーンタイムチャート */}
      <WeeklyActivityChartView />
      <YourLinks userId={userId} />
    </View>
  );
};

interface YourLinksProps {
  userId: string;
}

const YourLinks = ({ userId }: YourLinksProps) => {
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
    <View className="w-full">
      <ThemedText
        text={`Links Overview`}
        variant="body"
        color="default"
        weight="semibold"
      />
      <DataFetchState isLoading={isLoading} error={error}>
        <View className="mt-4 flex-col items-start justify-between gap-3">
          <LinkProgressBar
            title="Link Progress"
            items={getLinkProgressData().items}
            total={getLinkProgressData().total}
            showLegend={true}
          />
        </View>
      </DataFetchState>
    </View>
  );
};

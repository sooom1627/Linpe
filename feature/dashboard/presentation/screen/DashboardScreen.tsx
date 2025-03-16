import { useMemo } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { LinkProgressBar } from "../components";
import { type ProgressItem } from "../components/display/charts/LinkProgressBar";
import { WeeklyActivityChartView } from "../views/WeeklyActivityChartView";

export const DashboardScreen = () => {
  // リンク統計のダミーデータ（複数ステータスを含む）
  const linkProgressData = useMemo(() => {
    return {
      total: 150,
      items: [
        {
          id: "read",
          title: "Read",
          value: 82,
          color: "#3F3F46", // zinc-700
        },
        {
          id: "reread",
          title: "Re-Read",
          value: 35,
          color: "#71717A", // zinc-500
        },
        {
          id: "bookmark",
          title: "Bookmark",
          value: 20,
          color: "#A1A1AA", // zinc-400
        },
      ],
    };
  }, []);

  // 別のリンク統計の例（2つのステータスのみ）
  const savedLinksData = useMemo(() => {
    return {
      total: 80,
      items: [
        {
          id: "saved",
          title: "Saved",
          value: 45,
          color: "#3F3F46", // zinc-700
        },
        {
          id: "archived",
          title: "Archived",
          value: 15,
          color: "#A1A1AA", // zinc-400
        },
      ],
    };
  }, []);

  return (
    <View className="flex items-center justify-center gap-4 px-4 py-5">
      {/* スクリーンタイムチャート */}
      <WeeklyActivityChartView />
      <YourLinks
        linkProgressData={linkProgressData}
        savedLinksData={savedLinksData}
      />
    </View>
  );
};

interface YourLinksProps {
  linkProgressData: {
    total: number;
    items: ProgressItem[];
  };
  savedLinksData: {
    total: number;
    items: ProgressItem[];
  };
}

const YourLinks = ({ linkProgressData, savedLinksData }: YourLinksProps) => {
  return (
    <View className="w-full">
      <ThemedText
        text={`Links Overview`}
        variant="body"
        color="default"
        weight="semibold"
      />
      <View className="mt-4 flex-col items-start justify-between gap-3">
        <LinkProgressBar
          title="Link Progress"
          items={linkProgressData.items}
          total={linkProgressData.total}
          showLegend={true}
        />
        <LinkProgressBar
          title="Saved Links"
          items={savedLinksData.items}
          total={savedLinksData.total}
          showLegend={true}
        />
      </View>
    </View>
  );
};

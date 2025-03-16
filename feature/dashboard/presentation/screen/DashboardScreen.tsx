import { useMemo } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { ActivityChart, LinkProgressBar } from "../components";
import { type ProgressItem } from "../components/display/charts/LinkProgressBar";

export const DashboardScreen = () => {
  // スクリーンタイムのダミーデータ生成（7日分）
  const screenTimeData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return Array(7)
      .fill(0)
      .map((_, index) => ({
        day: days[index],
        add: Math.floor(Math.random() * 60), // 0-60分
        swipe: Math.floor(Math.random() * 45), // 0-45分
        read: Math.floor(Math.random() * 90), // 0-90分
      }));
  }, []);

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
      <View className="w-full rounded-xl bg-zinc-50 px-4 py-6 dark:bg-zinc-800">
        <ActivityChart title="Your Activity" data={screenTimeData} />
      </View>
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

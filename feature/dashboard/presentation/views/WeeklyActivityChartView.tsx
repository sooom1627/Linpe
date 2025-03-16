import { useMemo } from "react";
import { View } from "react-native";
import { TrendingUpIcon } from "lucide-react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { ActivityChart } from "../components";
import { ChartLegends } from "../components/display/charts/ChartLegends";
import { ChartData } from "../components/display/data/ChartData";

export const WeeklyActivityChartView = () => {
  const colors = {
    add: {
      main: "#3F3F46", // zinc-700 - 最も暗い
      light: "rgba(63, 63, 70, 0.85)",
    },
    swipe: {
      main: "#71717A", // zinc-500 - 中間
      light: "rgba(113, 113, 122, 0.85)",
    },
    read: {
      main: "#A1A1AA", // zinc-400 - 最も明るい
      light: "rgba(161, 161, 170, 0.85)",
    },
    grid: {
      line: "rgba(161, 161, 170, 0.2)", // 薄いグレー（ダークモードでも見やすい）
    },
  };

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

  return (
    <View className="w-full rounded-xl bg-zinc-50 px-4 py-6 dark:bg-zinc-800">
      {/* Title section */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <TrendingUpIcon size={16} color="#FA4714" strokeWidth={1.5} />
          <ThemedText
            text={"Weekly Activity"}
            variant="body"
            weight="semibold"
            color="default"
          />
        </View>
        <ThemedText
          text={"2025/03/16~2025/03/22"}
          variant="caption"
          weight="normal"
          color="muted"
        />
      </View>
      <ActivityChart title="Your Activity" data={screenTimeData} />
      <ChartLegends {...colors} />
      <ChartData {...colors} />
    </View>
  );
};

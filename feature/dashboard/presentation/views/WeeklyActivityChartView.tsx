import { useMemo } from "react";
import { View } from "react-native";
import { TrendingUpIcon } from "lucide-react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { ActivityChart } from "../components";
import {
  ChartLegends,
  type ActivityType,
} from "../components/display/charts/ChartLegends";
import { colors } from "../components/display/constants/colors";
import { ChartDataTable } from "../components/display/data/ChartDataTable";

export const WeeklyActivityChartView = () => {
  // Link 操作のダミーデータ
  const WeeklyActivityData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return Array(7)
      .fill(0)
      .map((_, index) => ({
        day: days[index],
        add: Math.floor(Math.random() * 60),
        swipe: Math.floor(Math.random() * 45),
        read: Math.floor(Math.random() * 90),
      }));
  }, []);

  // アクティビティの種類をWeeklyActivityDataから抽出
  const activities: ActivityType[] = useMemo(() => {
    if (WeeklyActivityData.length === 0) return [];

    // 最初のデータ項目からキーを取得し、dayを除外
    const firstDataItem = WeeklyActivityData[0];
    const activityKeys = Object.keys(firstDataItem).filter(
      (key) => key !== "day",
    );

    // キーからActivityType配列を生成
    return activityKeys.map((key) => {
      // キーがcolorsオブジェクトに存在し、mainプロパティを持っているか確認
      const colorKey = key as keyof typeof colors;
      const color =
        colorKey in colors && "main" in colors[colorKey]
          ? (colors[colorKey] as { main: string }).main
          : "#000000";

      return {
        type: key as "add" | "swipe" | "read",
        label: key,
        color,
      };
    });
  }, [WeeklyActivityData]);

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
      {/* Chart section */}
      <ActivityChart title="Your Activity" data={WeeklyActivityData} />
      {/* Legends section */}
      <ChartLegends activities={activities} />
      {/* Data table section */}
      <ChartDataTable data={WeeklyActivityData} activities={activities} />
    </View>
  );
};

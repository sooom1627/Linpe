import { useMemo } from "react";
import { View } from "react-native";
import { TrendingUpIcon } from "lucide-react-native";

import { ThemedText } from "@/components/text/ThemedText";
import {
  formatDateRange,
  weeklyActivityMockData,
} from "../../infrastructure/mock/weeklyActivityMockData";
import {
  ActivityLegends,
  WeeklyActivityChart,
  type ActivityType,
} from "../components/display/charts";
import { colors } from "../components/display/constants/colors";
import { ActivityStatsTable } from "../components/display/stats";

export const WeeklyActivityChartView = () => {
  // モックデータを使用
  const weeklyActivity = useMemo(() => weeklyActivityMockData, []);

  // 日付範囲の表示用文字列
  const dateRangeText = useMemo(() => {
    return formatDateRange(weeklyActivity.startDate, weeklyActivity.endDate);
  }, [weeklyActivity]);

  // アクティビティデータ - ActivityChartの型定義に合わせる
  const activityData = useMemo(() => {
    return weeklyActivity.data.map(({ day, add, swipe, read }) => ({
      day,
      add,
      swipe,
      read,
    }));
  }, [weeklyActivity]);

  // アクティビティの種類をactivityDataから抽出
  const activities: ActivityType[] = useMemo(() => {
    if (activityData.length === 0) return [];

    // 最初のデータ項目からキーを取得し、dayを除外
    const firstDataItem = activityData[0];
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
  }, [activityData]);

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
          text={dateRangeText}
          variant="caption"
          weight="normal"
          color="muted"
        />
      </View>
      {/* Chart section */}
      <WeeklyActivityChart title="Your Activity" data={activityData} />
      {/* Legends section */}
      <ActivityLegends activities={activities} />
      {/* Data table section */}
      <ActivityStatsTable data={activityData} activities={activities} />
    </View>
  );
};

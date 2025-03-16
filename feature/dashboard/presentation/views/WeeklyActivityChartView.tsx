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
} from "../components/display/charts";
import { colors } from "../components/display/constants/colors";
import {
  type ActivityType,
  type ActivityTypeValue,
} from "../components/display/constants/defaultActivities";
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
      // 安全に型チェックを行う
      const colorKey = key as string;
      let color = "#000000"; // デフォルト色

      // colorsオブジェクトにキーが存在するかチェック
      if (colorKey in colors) {
        const colorObj = colors[colorKey as keyof typeof colors];
        // mainプロパティが存在するかチェック
        if (colorObj && typeof colorObj === "object" && "main" in colorObj) {
          color = (colorObj as { main: string }).main;
        }
      }

      // ActivityTypeの型定義に合わせて安全にキャスト
      const activityType = key as ActivityTypeValue;

      return {
        type: activityType,
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

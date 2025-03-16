import { useMemo } from "react";
import { View } from "react-native";
import { TrendingUpIcon } from "lucide-react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useWeeklyActivity } from "../../application/hooks/useWeeklyActivity";
import { ChartDataPresenter } from "../../infrastructure/utils/chartDataPresenter";
import {
  ActivityLegends,
  WeeklyActivityChart,
} from "../components/display/charts";
import { colors } from "../components/display/constants/colors";
import { type ActivityType } from "../components/display/constants/defaultActivities";
import { ActivityStatsTable } from "../components/display/stats";

export const WeeklyActivityChartView = () => {
  const { data: rawActivityData, isLoading, error } = useWeeklyActivity();

  // アクティビティの種類を定義
  const activities: ActivityType[] = useMemo(
    () => [
      { type: "add", label: "add", color: colors.add.main },
      { type: "swipe", label: "swipe", color: colors.swipe.main },
      { type: "read", label: "read", color: colors.read.main },
    ],
    [],
  );

  // チャートデータに変換
  const activityData = useMemo(
    () => ChartDataPresenter.toActivityChartData(rawActivityData),
    [rawActivityData],
  );

  if (isLoading) {
    return (
      <View className="w-full rounded-xl bg-zinc-50 px-4 py-6 dark:bg-zinc-800">
        <ThemedText
          text="読み込み中..."
          variant="body"
          weight="medium"
          color="muted"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full rounded-xl bg-zinc-50 px-4 py-6 dark:bg-zinc-800">
        <ThemedText
          text="データの取得に失敗しました"
          variant="body"
          weight="medium"
          color="error"
        />
      </View>
    );
  }

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

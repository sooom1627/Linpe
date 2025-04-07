import { useMemo } from "react";
import { View } from "react-native";
import { TrendingUpDownIcon } from "lucide-react-native";

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
import { DataFetchState } from "../components/display/status/DataFetchState";

// アクティビティタイプの定数定義
const ACTIVITY_TYPES: ActivityType[] = [
  { type: "add", label: "add", color: colors.add.main },
  { type: "swipe", label: "swipe", color: colors.swipe.main },
  { type: "read", label: "read", color: colors.read.main },
];

export const WeeklyActivityChartView = () => {
  const { data: rawActivityData, isLoading, error } = useWeeklyActivity();

  // チャートデータに変換
  const activityData = useMemo(
    () => ChartDataPresenter.toActivityChartData(rawActivityData),
    [rawActivityData],
  );

  return (
    <View className="w-full flex-1">
      {/* Title section */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <TrendingUpDownIcon size={16} color="#FA4714" strokeWidth={1.5} />
          <ThemedText
            text={"Weekly Activity"}
            variant="body"
            weight="semibold"
            color="default"
          />
        </View>
      </View>
      <View className="w-full rounded-xl bg-zinc-50 px-4 py-6 dark:bg-zinc-800">
        {/* Content with loading/error handling */}
        <DataFetchState
          isLoading={isLoading}
          error={error}
          loadingText="Loading weekly activity..."
          errorText="Failed to load weekly activity"
        >
          {/* Chart section */}
          <WeeklyActivityChart title="Your Activity" data={activityData} />
          {/* Legends section */}
          <ActivityLegends activities={ACTIVITY_TYPES} />
          {/* Data table section */}
          <ActivityStatsTable data={activityData} activities={ACTIVITY_TYPES} />
        </DataFetchState>
      </View>
    </View>
  );
};

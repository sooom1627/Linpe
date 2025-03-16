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
  // アクティビティの種類を定義
  const activities: ActivityType[] = useMemo(
    () => [
      { type: "add", label: "add", color: colors.add.main },
      { type: "swipe", label: "swipe", color: colors.swipe.main },
      { type: "read", label: "read", color: colors.read.main },
    ],
    [],
  );

  // Link 操作のダミーでーた
  const screenTimeData = useMemo(() => {
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
      <ActivityChart title="Your Activity" data={screenTimeData} />
      {/* Legends section */}
      <ChartLegends activities={activities} />
      {/* Data table section */}
      <ChartDataTable data={screenTimeData} activities={activities} />
    </View>
  );
};

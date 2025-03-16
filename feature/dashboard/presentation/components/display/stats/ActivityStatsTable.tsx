import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import {
  defaultActivities,
  type ActivityType,
} from "../constants/defaultActivities";

// ActivityStatsTableのプロパティ
export interface ActivityStatsTableProps {
  data?: Array<{
    day: string;
    add: number;
    swipe: number;
    read: number;
    [key: string]: string | number;
  }>;
  activities?: ActivityType[];
}

export const ActivityStatsTable = ({
  data = [],
  activities = defaultActivities,
}: ActivityStatsTableProps) => {
  // データが空の場合は何も表示しない
  if (data.length === 0) return null;

  // 各アクティビティの平均値と合計値を計算
  const stats = activities.reduce(
    (acc, activity) => {
      const type = activity.type;
      const values = data.map((item) => Number(item[type]) || 0);
      const total = values.reduce((sum, val) => sum + val, 0);
      // 小数点以下1桁までを保持
      const average = total / values.length;
      const roundedAverage = Math.round(average * 10) / 10;

      return {
        ...acc,
        [type]: {
          average: roundedAverage,
          total,
          // フォーマット済みの文字列も提供
          formattedAverage: roundedAverage.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          }),
          formattedTotal: total.toLocaleString(),
        },
      };
    },
    {} as Record<
      string,
      {
        average: number;
        total: number;
        formattedAverage: string;
        formattedTotal: string;
      }
    >,
  );

  return (
    <View className="mt-2 border-t border-zinc-300 px-2 pt-4 dark:border-zinc-700">
      {/* ヘッダー行 */}
      <View className="mb-4 flex-row">
        <View className="flex-1">
          <ThemedText
            text="Actions"
            variant="small"
            weight="semibold"
            color="muted"
            className="text-xs"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text="Average"
            variant="small"
            weight="semibold"
            color="muted"
            className="text-right text-xs"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text="Total"
            variant="small"
            weight="semibold"
            color="muted"
            className="text-right text-xs"
          />
        </View>
      </View>

      {/* アクティビティ行 */}
      {activities.map((activity, index) => (
        <View
          key={activity.type}
          className={`flex-row items-center ${index !== activities.length - 1 && "mb-4"}`}
        >
          <View className="flex-1 flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-sm"
              style={{ backgroundColor: activity.color }}
            />
            <ThemedText
              text={activity.label || activity.type}
              variant="body"
              weight="medium"
              color="default"
              numberOfLines={1}
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={stats[activity.type]?.formattedAverage || "0"}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={stats[activity.type]?.formattedTotal || "0"}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
        </View>
      ))}
    </View>
  );
};

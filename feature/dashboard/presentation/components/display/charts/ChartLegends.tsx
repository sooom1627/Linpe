import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { colors } from "../constants/colors";

// 凡例に表示するアクティビティの種類を定義
export interface ActivityType {
  type: "add" | "swipe" | "read";
  label?: string;
  color?: string;
}

// ChartLegendsのプロパティ
export interface ChartLegendsProps {
  activities?: ActivityType[];
}

// デフォルトのアクティビティ
const defaultActivities: ActivityType[] = [
  { type: "add", label: "add", color: colors.add.main },
  { type: "swipe", label: "swipe", color: colors.swipe.main },
  { type: "read", label: "read", color: colors.read.main },
];

export const ChartLegends = ({
  activities = defaultActivities,
}: ChartLegendsProps) => {
  return (
    <View className="mt-2 flex-row justify-end gap-4 px-2">
      {activities.map((activity) => (
        <View key={activity.type} className="flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: activity.color }}
          />
          <ThemedText
            text={activity.label || activity.type}
            variant="small"
            color="muted"
            className="text-xs"
          />
        </View>
      ))}
    </View>
  );
};

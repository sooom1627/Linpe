import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import {
  defaultActivities,
  useDefaultActivities,
  type ActivityType,
} from "../constants/defaultActivities";

// ActivityLegendsのプロパティ
export interface ActivityLegendsProps {
  activities?: ActivityType[];
  useColorScheme?: boolean; // カラーモードに応じた色を使用するかどうか
}

export const ActivityLegends = ({
  activities,
  useColorScheme = false,
}: ActivityLegendsProps) => {
  // カラーモードに応じたアクティビティを取得
  const colorSchemeActivities = useDefaultActivities();

  // useColorSchemeフラグがtrueの場合はカラーモード対応の色を使用
  const displayActivities = useColorScheme
    ? colorSchemeActivities
    : activities || defaultActivities;

  return (
    <View className="mt-2 flex-row justify-end gap-4 px-2">
      {displayActivities.map((activity) => (
        <View
          key={activity.type}
          className="flex-row items-center"
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`${activity.label || activity.type}アクティビティを表す凡例`}
        >
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

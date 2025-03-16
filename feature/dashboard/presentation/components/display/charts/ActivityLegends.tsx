import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import {
  defaultActivities,
  type ActivityType,
} from "../constants/defaultActivities";

// ActivityLegendsのプロパティ
export interface ActivityLegendsProps {
  activities?: ActivityType[];
}

export const ActivityLegends = ({
  activities = defaultActivities,
}: ActivityLegendsProps) => {
  return (
    <View className="mt-2 flex-row justify-end gap-4 px-2">
      {activities.map((activity) => (
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

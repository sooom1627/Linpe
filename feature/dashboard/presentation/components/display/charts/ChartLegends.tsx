import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { colors } from "../constants/colors";

export const ChartLegends = () => {
  return (
    <View className="mt-2 flex-row justify-end gap-4 px-2">
      <View className="flex-row items-center">
        <View
          className="mr-2 h-3 w-3 rounded-sm"
          style={{ backgroundColor: colors.add.main }}
        />
        <ThemedText
          text={`add`}
          variant="small"
          color="muted"
          className="text-xs"
        />
      </View>

      <View className="flex-row items-center">
        <View
          className="mr-2 h-3 w-3 rounded-sm"
          style={{ backgroundColor: colors.swipe.main }}
        />
        <ThemedText
          text={`swipe`}
          variant="small"
          color="muted"
          className="text-xs"
        />
      </View>

      <View className="flex-row items-center">
        <View
          className="mr-2 h-3 w-3 rounded-sm"
          style={{ backgroundColor: colors.read.main }}
        />
        <ThemedText
          text={`read`}
          variant="small"
          color="muted"
          className="text-xs"
        />
      </View>
    </View>
  );
};

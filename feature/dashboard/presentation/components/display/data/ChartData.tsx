import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

export const ChartData = (colors: {
  add: {
    main: string;
    light: string;
  };
  swipe: {
    main: string;
    light: string;
  };
  read: {
    main: string;
    light: string;
  };
}) => {
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

      {/* add行 */}
      <View className="mb-4 flex-row items-center">
        <View className="flex-1 flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: colors.add.main }}
          />
          <ThemedText
            text="add"
            variant="body"
            weight="medium"
            color="default"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text={`15`}
            variant="body"
            weight="medium"
            color="muted"
            className="text-right"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text={`30`}
            variant="body"
            weight="medium"
            color="muted"
            className="text-right"
          />
        </View>
      </View>

      {/* swipe行 */}
      <View className="mb-4 flex-row items-center">
        <View className="flex-1 flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: colors.swipe.main }}
          />
          <ThemedText
            text="swipe"
            variant="body"
            weight="medium"
            color="default"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text={`12`}
            variant="body"
            weight="medium"
            color="muted"
            className="text-right"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text={`30`}
            variant="body"
            weight="medium"
            color="muted"
            className="text-right"
          />
        </View>
      </View>

      {/* read行 */}
      <View className="flex-row items-center">
        <View className="flex-1 flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: colors.read.main }}
          />
          <ThemedText
            text="read"
            variant="body"
            weight="medium"
            color="default"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text={`18`}
            variant="body"
            weight="medium"
            color="muted"
            className="text-right"
          />
        </View>
        <View className="w-20">
          <ThemedText
            text={`30`}
            variant="body"
            weight="medium"
            color="muted"
            className="text-right"
          />
        </View>
      </View>
    </View>
  );
};

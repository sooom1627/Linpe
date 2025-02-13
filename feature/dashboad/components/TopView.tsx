import { View } from "react-native";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import { TrendingUpIcon } from "@/components/icons/TrendingUpIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { StatCard } from "./StatCard";

export const TopView = () => {
  return (
    <View className="flex w-full flex-col gap-2 rounded-lg bg-white">
      <View className="flex flex-row items-center gap-2">
        <TrendingUpIcon size={16} />
        <ThemedText variant="body" weight="semibold" color="default">
          {["Overview"]}
        </ThemedText>
        <ThemedText variant="caption" weight="medium" color="muted">
          {["Swipe left to add a new note."]}
        </ThemedText>
      </View>
      <View className="flex w-full flex-row justify-between gap-2">
        <StatCard title="Add" value="24" Icon={LinkIcon} />
        <StatCard title="Swipe" value="16" Icon={SwapIcon} />
        <StatCard title="Read" value="32" Icon={CheckIcon} />
      </View>
    </View>
  );
};

import { View } from "react-native";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import { TrendingUpIcon } from "@/components/icons/TrendingUpIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { formatDate } from "@/util/format";
import { StatCard } from "../stats/StatCard";

const stats = [
  { title: "Add", value: "24", icon: LinkIcon },
  { title: "Swipe", value: "16", icon: SwapIcon },
  { title: "Read", value: "32", icon: CheckIcon },
];

export const TopView = () => {
  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <View className="flex w-full flex-col gap-2 rounded-lg bg-white">
      <View className="flex flex-row items-center justify-start gap-2">
        <View className="flex flex-row items-center gap-2">
          <TrendingUpIcon size={16} />
          <ThemedText variant="body" weight="semibold" color="default">
            {["Overview"]}
          </ThemedText>
        </View>
        <View className="flex flex-row items-center gap-2">
          <ThemedText variant="caption" weight="medium" color="muted">
            {[formattedDate]}
          </ThemedText>
        </View>
      </View>
      <View className="flex w-full flex-row justify-between gap-2">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            Icon={stat.icon}
          />
        ))}
      </View>
    </View>
  );
};

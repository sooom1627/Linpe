import { View } from "react-native";
import { TrendingUpDownIcon } from "lucide-react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { formatDate } from "@/lib/utils/format";
import { StatCardSkeleton } from "./StatCardSkeleton";

/**
 * TodaysOverviewコンポーネントのスケルトンローディング表示
 */
export const TodaysOverviewSkeleton = () => {
  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <View className="flex w-full flex-col gap-2 rounded-lg bg-white">
      <View className="flex flex-row items-center justify-start gap-2">
        <View className="flex flex-row items-center gap-2">
          <TrendingUpDownIcon size={16} color="#FA4714" strokeWidth={1.5} />
          <ThemedText
            text="Overview"
            variant="body"
            weight="semibold"
            color="default"
          />
        </View>
        <View className="flex flex-row items-center gap-2">
          <ThemedText
            text={formattedDate}
            variant="caption"
            weight="medium"
            color="muted"
          />
        </View>
      </View>
      <View className="flex w-full flex-row justify-between gap-2">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
    </View>
  );
};

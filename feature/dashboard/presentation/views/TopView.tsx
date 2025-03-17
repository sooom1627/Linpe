import { View } from "react-native";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import { TrendingUpIcon } from "@/components/icons/TrendingUpIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { useSession } from "@/feature/auth/application/hooks/useSession";
import { useActionLogCount } from "@/feature/dashboard/application/hooks/useActionLogCount";
import { StatCard } from "@/feature/dashboard/presentation/components/display/stats/StatCard";
import { formatDate } from "@/lib/utils/format";

export const TopView = () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const { session } = useSession();
  const userId = session?.user?.id || "";
  const { data: actionLogCount, isLoading, error } = useActionLogCount(userId);

  const stats = [
    {
      title: "Add",
      value: isLoading
        ? "-"
        : actionLogCount
          ? actionLogCount.add.toString()
          : "0",
      icon: LinkIcon,
    },
    {
      title: "Swipe",
      value: isLoading
        ? "-"
        : actionLogCount
          ? actionLogCount.swipe.toString()
          : "0",
      icon: SwapIcon,
    },
    {
      title: "Read",
      value: isLoading
        ? "-"
        : actionLogCount
          ? actionLogCount.read.toString()
          : "0",
      icon: CheckIcon,
    },
  ];

  return (
    <View className="flex w-full flex-col gap-2 rounded-lg bg-white">
      <View className="flex flex-row items-center justify-start gap-2">
        <View className="flex flex-row items-center gap-2">
          <TrendingUpIcon size={16} />
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
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            Icon={stat.icon}
          />
        ))}
      </View>
      {error && (
        <View className="mt-2">
          <ThemedText
            text="データの取得に失敗しました"
            variant="caption"
            weight="medium"
            color="error"
          />
        </View>
      )}
    </View>
  );
};

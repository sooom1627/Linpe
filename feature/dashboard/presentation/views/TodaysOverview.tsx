import { View } from "react-native";
import { TrendingUpDownIcon } from "lucide-react-native";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { SwapIcon } from "@/components/icons/SwapIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { useSession } from "@/feature/auth/application/hooks/useSession";
import { useActionLogCount } from "@/feature/dashboard/application/hooks/useActionLogCount";
import { TodaysOverviewSkeleton } from "@/feature/dashboard/presentation/components/display/skeleton/TodaysOverviewSkeleton";
import { StatCard } from "@/feature/dashboard/presentation/components/display/stats/StatCard";
import { formatDate } from "@/lib/utils/format";

export const TodaysOverview = () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const { session } = useSession();
  const userId = session?.user?.id || "";
  const { data: actionLogCount, isLoading, error } = useActionLogCount(userId);

  const stats = [
    {
      title: "Add",
      value: actionLogCount ? actionLogCount.add.toString() : "0",
      icon: LinkIcon,
    },
    {
      title: "Swipe",
      value: actionLogCount ? actionLogCount.swipe.toString() : "0",
      icon: SwapIcon,
    },
    {
      title: "Read",
      value: actionLogCount ? actionLogCount.read.toString() : "0",
      icon: CheckIcon,
    },
  ];

  if (isLoading) {
    return <TodaysOverviewSkeleton />;
  }

  if (error) {
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
        <View className="w-full py-4">
          <ThemedText
            text="データの取得に失敗しました"
            variant="body"
            weight="medium"
            color="error"
          />
        </View>
      </View>
    );
  }

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

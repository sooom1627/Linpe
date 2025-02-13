import { View } from "react-native";

import { type IconProps } from "@/components/icons/types";
import { ThemedText } from "@/components/text/ThemedText";

type StatCardProps = {
  title: string;
  value: string;
  Icon: React.FC<IconProps>;
};

export const StatCard = ({ title, value, Icon }: StatCardProps) => {
  return (
    <View className="flex-1 rounded-lg bg-zinc-50 p-3">
      <View className="flex flex-row items-center justify-between gap-2">
        <ThemedText variant="caption" weight="medium" color="default">
          {[title]}
        </ThemedText>
        <Icon size={16} color="#FA4714" />
      </View>
      <View className="mt-2">
        <ThemedText variant="body" weight="semibold" color="default">
          {[value]}
        </ThemedText>
        <ThemedText variant="caption" weight="medium" color="muted">
          {["today"]}
        </ThemedText>
      </View>
    </View>
  );
};

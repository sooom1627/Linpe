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
        <ThemedText
          text={title}
          variant="caption"
          weight="medium"
          color="default"
        />
        <Icon size={16} color="#FA4714" />
      </View>
      <View className="mt-2">
        <ThemedText
          text={value}
          variant="body"
          weight="semibold"
          color="default"
        />
        <ThemedText
          text="today"
          variant="caption"
          weight="medium"
          color="muted"
        />
      </View>
    </View>
  );
};

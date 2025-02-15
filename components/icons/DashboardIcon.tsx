import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type DashboardIconProps = {
  active?: boolean;
  size?: number;
};

export const DashboardIcon = ({
  active = false,
  size = 24,
}: DashboardIconProps) => {
  return (
    <View className="text-zinc-600">
      <MaterialCommunityIcons
        name="view-dashboard"
        size={size}
        color={active ? "#FA4714" : "#52525b"}
      />
    </View>
  );
};

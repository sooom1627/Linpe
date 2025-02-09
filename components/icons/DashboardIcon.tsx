import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type DashboardIconProps = {
  active?: boolean; // オプショナルにする
};

export const DashboardIcon = ({ active = false }: DashboardIconProps) => {
  return (
    <View className="text-zinc-600">
      <MaterialIcons
        name="dashboard"
        size={24}
        color={active ? "#FA4714" : "#52525b"}
      />
    </View>
  );
};

import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type HomeIconProps = {
  active?: boolean; // オプショナルにする
  size?: number;
};

export const HomeIcon = ({ active = false, size = 24 }: HomeIconProps) => {
  return (
    <View className="text-zinc-600">
      <MaterialCommunityIcons
        name="home"
        size={size}
        color={active ? "#FA4714" : "#52525b"}
      />
    </View>
  );
};

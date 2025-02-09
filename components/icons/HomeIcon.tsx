import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type HomeIconProps = {
  active?: boolean; // オプショナルにする
};

export const HomeIcon = ({ active = false }: HomeIconProps) => {
  return (
    <View className="text-zinc-600">
      <MaterialCommunityIcons
        name="home"
        size={24}
        color={active ? "#FA4714" : "#52525b"}
      />
    </View>
  );
};

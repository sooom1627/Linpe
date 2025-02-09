import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SwipeIconProps = {
  active?: boolean; // オプショナルにする
};

export const SwipeIcon = ({ active = false }: SwipeIconProps) => {
  return (
    <View className="text-zinc-600">
      <MaterialCommunityIcons
        name="card-multiple"
        size={24}
        color={active ? "#FA4714" : "#52525b"}
      />
    </View>
  );
};

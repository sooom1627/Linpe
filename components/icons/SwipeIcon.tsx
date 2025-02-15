import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SwipeIconProps = {
  active?: boolean;
  size?: number;
};

export const SwipeIcon = ({ active = false, size = 24 }: SwipeIconProps) => {
  return (
    <View className="text-zinc-600">
      <MaterialCommunityIcons
        name="cards"
        size={size}
        color={active ? "#FA4714" : "#52525b"}
      />
    </View>
  );
};

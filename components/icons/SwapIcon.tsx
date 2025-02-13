import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  size?: number;
  color?: string;
};

export const SwapIcon = ({ size = 24, color = "#52525b" }: Props) => {
  return (
    <View className="text-zinc-600">
      <AntDesign name="swap" size={size} color={color} />
    </View>
  );
};

import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  size?: number;
  color?: string;
};

export const CheckIcon = ({ size = 24, color = "#52525b" }: Props) => {
  return (
    <View className="text-zinc-600">
      <AntDesign name="check" size={size} color={color} />
    </View>
  );
};

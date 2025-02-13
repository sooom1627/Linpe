import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { type IconProps } from "./types";

export const LinkIcon = ({ size = 24, color = "#52525b" }: IconProps) => {
  return (
    <View className="text-zinc-600">
      <AntDesign name="link" size={size} color={color} />
    </View>
  );
};

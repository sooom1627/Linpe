import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const CloseIcon = ({ size }: { size: number }) => {
  return (
    <View className="text-zinc-600">
      <AntDesign name="close" size={size} color={"#52525b"} />
    </View>
  );
};

import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const ChevronLeftIcon = () => {
  return (
    <View className="text-zinc-600">
      <MaterialIcons name="chevron-left" size={24} color={"#52525b"} />
    </View>
  );
};

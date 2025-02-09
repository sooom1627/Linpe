import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const MenuIcon = () => {
  return (
    <View className="text-zinc-600">
      <MaterialIcons name="menu" size={24} color={"#52525b"} />
    </View>
  );
};

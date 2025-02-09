import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const AddCircleIcon = ({ size }: { size: number }) => {
  return (
    <View className="text-zinc-600">
      <MaterialIcons name="add-circle" size={size} color={"#52525b"} />
    </View>
  );
};

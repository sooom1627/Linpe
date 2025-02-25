import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LinkInputLayout() {
  const router = useRouter();
  const backgroundColor = "#FFFFFF";
  const textColor = "#000000";

  const handleClose = () => {
    router.back();
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "リンクを追加",
        headerRight: () => (
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}

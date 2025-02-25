import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LinkInputLayout() {
  const router = useRouter();
  const textColor = "#000000";

  const handleClose = () => {
    router.back();
  };

  return (
    <Stack
      screenOptions={{
        presentation: "formSheet",
        contentStyle: {
          backgroundColor: "",
          height: 280,
        },
        sheetGrabberVisible: false,
        gestureDirection: "vertical",
        animation: "slide_from_bottom",
        headerShown: false,
        sheetInitialDetentIndex: 0,
        sheetAllowedDetents: [0.36, 0.36],
        headerTitle: "",
        headerRight: () => (
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}

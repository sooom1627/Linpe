import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { sheetScreenOptions } from "@/components/layout/bottom-sheet/constants/screenOption";

export default function LinkActionLayoutView() {
  const router = useRouter();
  const textColor = "#000000";

  const handleClose = () => {
    router.back();
  };

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        ),
        ...sheetScreenOptions,
      }}
    />
  );
}

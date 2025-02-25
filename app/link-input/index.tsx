import { View } from "react-native";
import { useRouter } from "expo-router";

import { LinkInputView } from "@/feature/links/presentation/views/LinkInputView";

export default function LinkInputPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1 p-4">
      <LinkInputView onClose={handleClose} />
    </View>
  );
}

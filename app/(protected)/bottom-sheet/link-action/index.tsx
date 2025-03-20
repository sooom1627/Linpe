import { View } from "react-native";
import { useRouter } from "expo-router";

import { LinkActionView } from "@/feature/links/presentation/views/LinkActionView";

export default function LinkActionPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1 p-3">
      <View className="flex-1 rounded-2xl bg-white px-6 py-8">
        <LinkActionView onClose={handleClose} />
      </View>
    </View>
  );
}

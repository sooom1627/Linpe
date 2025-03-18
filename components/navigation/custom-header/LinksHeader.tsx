import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ThemedText } from "@/components/text/ThemedText";

export function LinksHeader() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="h-16 flex-row items-center justify-between border-b border-zinc-200 bg-white px-4">
      <View className="flex-row items-center justify-center gap-4">
        <TouchableOpacity onPress={handleBackPress}>
          <ChevronLeftIcon />
        </TouchableOpacity>
        <ThemedText text="Links" variant="h4" weight="semibold" />
      </View>
    </View>
  );
}

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ThemedText } from "@/components/text/ThemedText";

export default function LinksModal() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={styles.container}>
      {/* カスタムヘッダー部分 */}
      <View className="h-16 flex-row items-center justify-between border-b border-zinc-200 bg-white px-4">
        <View className="flex-row items-center justify-center gap-4">
          <TouchableOpacity onPress={handleBackPress}>
            <ChevronLeftIcon />
          </TouchableOpacity>
          <ThemedText text="Links" variant="h4" weight="semibold" />
        </View>
      </View>

      {/* コンテンツ部分 */}
      <View className="flex-1 bg-white p-4">
        <View className="flex-col items-center justify-center">
          <ThemedText
            text="Your Links"
            variant="h2"
            weight="medium"
            color="default"
          />
          <View className="my-4">
            <ThemedText
              text="This is the links page"
              variant="body"
              weight="normal"
              color="default"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// スタイルをStyleSheetで定義
const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
});

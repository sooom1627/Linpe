import { StyleSheet, View } from "react-native";

import { LinksHeader } from "@/components/navigation/custom-header/LinksHeader";
import { ThemedText } from "@/components/text/ThemedText";

export default function LinksModal() {
  return (
    <View className="flex-1" style={styles.container}>
      {/* カスタムヘッダー部分 */}
      <LinksHeader />

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

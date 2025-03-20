import { StyleSheet, View } from "react-native";

import { LinksHeader } from "@/components/navigation/custom-header/LinksHeader";
import { LinkListView } from "@/feature/links/presentation/views/LinkListView";

export default function LinksModal() {
  return (
    <View style={styles.container}>
      {/* カスタムヘッダー部分 */}
      <LinksHeader />

      {/* コンテンツ部分 */}
      <View className="mb-8 flex-1 px-4 pt-2">
        <LinkListView />
      </View>
    </View>
  );
}

// スタイルをStyleSheetで定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
});

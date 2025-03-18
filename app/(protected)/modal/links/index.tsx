import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { LinksHeader } from "@/components/navigation/custom-header/LinksHeader";
import { LinkListView } from "@/feature/links/presentation/views/LinkListView";

export default function LinksModal() {
  return (
    <View style={styles.container}>
      {/* カスタムヘッダー部分 */}
      <LinksHeader />

      {/* コンテンツ部分 */}
      <ScrollView className="mb-8 flex-1 px-4 py-5">
        <LinkListView />
      </ScrollView>
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

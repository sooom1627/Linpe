import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { ArticleFlatList } from "@/feature/article/components/ArticleFlatlist";

export default function Index() {
  return (
    <ScrollView className="flex-1">
      <View className="flex flex-col gap-4 p-4">
        <View className="items-left flex justify-center">
          <ThemedText variant="h3" weight="medium" color="default">
            {["Start here\n" + "capture your insights."]}
          </ThemedText>
        </View>
        <View className="flex flex-col gap-4">
          <Title title="Recommended Articles" />
          <ArticleFlatList />
        </View>
      </View>
    </ScrollView>
  );
}

import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { TopView } from "@/feature/dashboad/components";
import { LinksTopView } from "@/feature/links/components/views/LinksTopView";

export default function Index() {
  return (
    <ScrollView className="flex-1">
      <View className="flex flex-col gap-4 p-4">
        <View className="items-left flex justify-start gap-2">
          <View className="flex items-start py-4">
            <View className="flex flex-row flex-wrap items-end">
              <ThemedText variant="h2" weight="medium" color="default">
                {["Start here,\ncapture your "]}
              </ThemedText>
              <ThemedText variant="h2" weight="medium" color="accent">
                {["insights"]}
              </ThemedText>
              <ThemedText variant="h2" weight="medium" color="default">
                {["."]}
              </ThemedText>
            </View>
          </View>
          <View className="mb-2 border-b border-zinc-400" />
          <TopView />
        </View>
        <LinksTopView />
      </View>
    </ScrollView>
  );
}

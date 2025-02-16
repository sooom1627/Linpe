import { ScrollView, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { TopView } from "@/feature/dashboard/components";
import { LinksTopView } from "@/feature/links/components/views/LinksTopView";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";

const FloatingButton = () => {
  const { openModal } = useLinkInputModal();

  return (
    <TouchableOpacity
      onPress={openModal}
      activeOpacity={0.8}
      className="absolute bottom-24 right-4 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
    >
      <ThemedText variant="h3" weight="bold" color="white">
        {["+"]}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default function Index() {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="flex flex-col gap-4 px-4">
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
      <FloatingButton />
    </View>
  );
}

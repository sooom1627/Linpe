import { ScrollView, View } from "react-native";

import { ActionButton } from "@/components/actions/ActionButton";
import { ThemedText } from "@/components/text/ThemedText";
import { TopView } from "@/feature/dashboard/components";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { LinksTopView } from "@/feature/links/views/LinksTopView";

const FloatingButton = () => {
  const { openModal } = useLinkInputModal();

  return (
    <ActionButton
      onPress={openModal}
      size="large"
      className="absolute bottom-16 right-6"
      accessibilityLabel="Add new link"
      accessibilityHint="Open modal to add a new link"
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
    >
      <ThemedText variant="h3" weight="bold" color="white">
        {["+"]}
      </ThemedText>
    </ActionButton>
  );
};

export default function Index() {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="flex flex-col gap-4 px-4">
          <View className="items-left flex justify-start gap-2">
            <View className="flex items-start pb-4 pt-6">
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

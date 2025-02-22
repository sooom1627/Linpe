import { ScrollView, View } from "react-native";

import { ActionButton } from "@/components/actions/ActionButton";
import { ThemedText } from "@/components/text/ThemedText";
import { TopView } from "@/feature/dashboard/components";
import { useLinkInputModal } from "@/feature/links/application/context/LinkInputModalContext";
import { LinksTopView } from "@/feature/links/presentation/views/LinksTopView";

const FloatingButton = () => {
  const { openModal } = useLinkInputModal();

  return (
    <ActionButton
      onPress={openModal}
      size="large"
      className="absolute bottom-12 right-6"
      accessibilityLabel="Add new link"
      accessibilityHint="Open modal to add a new link"
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
    >
      <ThemedText text="+" variant="h3" weight="bold" color="white" />
    </ActionButton>
  );
};

export default function Index() {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="flex-1 flex-col gap-4 px-4">
          <View className="items-left flex justify-start gap-2">
            <View className="flex items-start pb-4 pt-6">
              <View className="flex flex-col flex-wrap items-start gap-1">
                <ThemedText
                  text="Start here,"
                  variant="h2"
                  weight="medium"
                  color="default"
                />
                <View className="flex flex-row items-end gap-2">
                  <ThemedText
                    text="capture your"
                    variant="h2"
                    weight="medium"
                    color="default"
                  />
                  <ThemedText
                    text="insights"
                    variant="h2"
                    weight="medium"
                    color="accent"
                  />
                  <ThemedText
                    text="."
                    variant="h2"
                    weight="medium"
                    color="default"
                  />
                </View>
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

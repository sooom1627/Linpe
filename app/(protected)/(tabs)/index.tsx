import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ActionButton } from "@/components/actions/ActionButton";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { TodaysOverview } from "@/feature/dashboard/presentation/views/TodaysOverview";
import { TodaysLinksView } from "@/feature/links/presentation/views/TodaysLinksView";
import { WeeekEndLinksView } from "@/feature/links/presentation/views/WeeekEndLinksView";

const FloatingButton = () => {
  const router = useRouter();

  const openBottomSheet = () => {
    router.push("/(protected)/bottom-sheet/link-input");
  };

  return (
    <ActionButton
      onPress={openBottomSheet}
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
  const router = useRouter();

  const navigateToLinks = () => {
    router.push("/(protected)/links");
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-white">
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
            <View className="mb-2 border-b border-zinc-200" />
            <TodaysOverview />
          </View>
          <TodaysLinksView />
          <View className="mb-2 border-b border-zinc-200" />
          <WeeekEndLinksView />
          {/* View All Links Button */}
          <TouchableOpacity
            onPress={navigateToLinks}
            className="mb-4 flex-row items-center justify-between rounded-lg border border-zinc-200 bg-white p-4"
          >
            <ThemedText
              text="View All Links"
              variant="body"
              weight="medium"
              color="default"
            />
            <ChevronRightIcon size={16} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FloatingButton />
    </View>
  );
}

import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import type { OGData } from "../../types/links";
import { HorizontalCard } from "../cards/HorizontalCard";
import { LoadingCard } from "../cards/LoadingCard";

interface LinkPreviewProps {
  url: string;
  ogData: OGData | null;
  isLoading: boolean;
  isError: boolean;
}

export const LinkPreview = ({
  url,
  ogData,
  isLoading,
  isError,
}: LinkPreviewProps) => {
  if (!url) {
    return (
      <View className="h-20 items-center justify-center rounded-lg border border-gray-200">
        <ThemedText className="text-gray-400">
          {["Please enter a URL"]}
        </ThemedText>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="h-20">
        <LoadingCard variant="horizontal" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="h-20 items-center justify-center rounded-lg border border-red-200 bg-red-50">
        <ThemedText className="text-red-400">
          {["Failed to load data"]}
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="h-20">
      <HorizontalCard full_url={url} ogData={ogData} />
    </View>
  );
};

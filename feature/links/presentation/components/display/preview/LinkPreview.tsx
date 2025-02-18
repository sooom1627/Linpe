import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import type { OGData } from "../../../../domain/models/types";
import { HorizontalCard, LoadingCard } from "../cards";

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
        <ThemedText
          text="Please enter a URL"
          variant="body"
          weight="medium"
          color="muted"
        />
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
        <ThemedText
          text="Failed to load data"
          variant="body"
          weight="medium"
          color="muted"
        />
      </View>
    );
  }

  return (
    <View className="h-20">
      <HorizontalCard full_url={url} ogData={ogData} />
    </View>
  );
};

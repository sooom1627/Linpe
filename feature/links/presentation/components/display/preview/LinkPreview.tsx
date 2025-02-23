import { useMemo } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { cardService } from "@/feature/links/application/service/cardService";
import type { OGData } from "@/feature/links/domain/models/types";
import { HorizontalCard } from "@/feature/links/presentation/components/display/cards/HorizontalCard";
import { LoadingCard } from "@/feature/links/presentation/components/display/status/cards/LoadingCard";

interface LinkPreviewProps {
  full_url: string;
  ogData: OGData | null;
  isLoading: boolean;
  isError: boolean;
}

export const LinkPreview = ({
  full_url,
  ogData,
  isLoading,
  isError,
}: LinkPreviewProps) => {
  const cards = useMemo(() => {
    return cardService.createCards(
      [
        {
          link_id: full_url,
          full_url: full_url,
          domain: new URL(full_url).hostname,
          parameter: "",
          link_created_at: new Date().toISOString(),
          status: "add",
          added_at: new Date().toISOString(),
          scheduled_read_at: null,
          read_at: null,
          read_count: 0,
          swipe_count: 0,
          user_id: "",
        },
      ],
      {
        [full_url]: ogData,
      },
    );
  }, [full_url, ogData]);

  if (!full_url) {
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
      <HorizontalCard
        full_url={full_url}
        domain={cards[0].domain}
        imageUrl={cards[0].imageUrl}
        title={cards[0].title}
      />
    </View>
  );
};

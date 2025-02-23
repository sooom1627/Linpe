import { useMemo } from "react";
import { View } from "react-native";
import { randomUUID } from "expo-crypto";

import { ThemedText } from "@/components/text/ThemedText";
import { cardService } from "@/feature/links/application/service/cardService";
import type { OGData } from "@/feature/links/domain/models/types";
import { HorizontalCard } from "@/feature/links/presentation/components/display/cards/HorizontalCard";
import { LoadingCard } from "@/feature/links/presentation/components/display/status/cards/LoadingCard";

const ALLOWED_PROTOCOLS = ["http:", "https:"];
const MAX_URL_LENGTH = 2048;

const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return (
      ALLOWED_PROTOCOLS.includes(parsedUrl.protocol) &&
      url.length <= MAX_URL_LENGTH &&
      !parsedUrl.hostname.includes("localhost") &&
      !parsedUrl.hostname.includes("127.0.0.1")
    );
  } catch {
    return false;
  }
};

const getErrorMessage = (isError: boolean, hasCards: boolean): string => {
  if (isError) return "データの読み込みに失敗しました";
  if (!hasCards) return "プレビューを表示できません";
  return "";
};

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
    if (!isValidUrl(full_url)) {
      return [];
    }

    const link_id = randomUUID();

    try {
      return cardService.createCards(
        [
          {
            link_id,
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
    } catch (error) {
      console.error("Failed to create card:", error);
      return [];
    }
  }, [full_url, ogData]);

  if (!full_url) {
    return (
      <View className="h-20 items-center justify-center rounded-lg border border-gray-200">
        <ThemedText
          text="URLを入力してください"
          variant="body"
          weight="medium"
          color="muted"
        />
      </View>
    );
  }

  if (!isValidUrl(full_url)) {
    return (
      <View className="h-20 items-center justify-center rounded-lg border border-red-200 bg-red-50">
        <ThemedText
          text="無効なURL形式です"
          variant="body"
          weight="medium"
          color="error"
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
          text={getErrorMessage(true, false)}
          variant="body"
          weight="medium"
          color="error"
        />
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View className="h-20 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <ThemedText
          text={getErrorMessage(false, false)}
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

import { useMemo } from "react";
import { FlatList as RNFlatList, View } from "react-native";
import { router } from "expo-router";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { cardService } from "@/feature/links/application/service/cardService";
import {
  type OGData,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { HorizontalCard } from "../cards";

/**
 * 安全なエンコード関数
 * パラメータを安全にエンコードする
 */
const safeEncodeURIComponent = (value: string | undefined | null): string => {
  if (!value) return "";

  try {
    // 標準的なエンコード処理を試みる
    return encodeURIComponent(value);
  } catch (error) {
    // エンコードに失敗した場合、安全な文字だけを残す
    console.error("Error in safeEncodeURIComponent:", error);
    try {
      return encodeURIComponent(value.replace(/[^\w\s-]/g, ""));
    } catch (fallbackError) {
      // 最終手段として空文字を返す
      console.error("Error in safeEncodeURIComponent fallback:", fallbackError);
      return "";
    }
  }
};

type Props = {
  links: UserLink[];
  ogDataMap: { [key: string]: OGData | null };
};

export const LinksFlatList = ({ links, ogDataMap }: Props) => {
  const { session } = useSessionContext();

  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  const openBottomSheet = (cardId: number) => {
    const selectedCard = cards.find((card) => card.id === cardId);
    if (selectedCard && session?.user) {
      // URLパラメータとしてカード情報を渡す
      router.push({
        pathname: "/(protected)/bottom-sheet/link-action",
        params: {
          linkId: selectedCard.link_id,
          userId: session.user.id,
          imageUrl: safeEncodeURIComponent(selectedCard.imageUrl),
          title: safeEncodeURIComponent(selectedCard.title),
          domain: safeEncodeURIComponent(selectedCard.domain),
          full_url: safeEncodeURIComponent(selectedCard.full_url),
          swipeCount: selectedCard.swipe_count,
        },
      });
    }
  };

  return (
    <RNFlatList
      data={cards}
      renderItem={({ item }) => (
        <HorizontalCard {...item} onAction={() => openBottomSheet(item.id)} />
      )}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListFooterComponent={() => <View className="h-4" />}
    />
  );
};

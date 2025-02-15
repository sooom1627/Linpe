import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";

import { ThemedText } from "@/components/text/ThemedText";

const DUMMY_CARDS = [
  { id: 1, title: "カード 1" },
  { id: 2, title: "カード 2" },
  { id: 3, title: "カード 3" },
  { id: 4, title: "カード 4" },
  { id: 5, title: "カード 5" },
];

export default function SwipeScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const [cards, setCards] = useState(DUMMY_CARDS);

  const handleReload = () => {
    setCards(DUMMY_CARDS);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 text-xl">全てのカードを確認しました</Text>
        <TouchableOpacity
          onPress={handleReload}
          className="rounded-lg bg-blue-500 px-6 py-3"
        >
          <Text className="text-white">もう一度見る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex items-center justify-center">
      <Swiper
        cards={cards}
        renderCard={() => (
          <View className="flex-col items-center justify-center gap-4 bg-white">
            <Image
              source={{
                uri: "https://ph-static.imgix.net/ph-logo-1.png",
              }}
              className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-50"
            />
            <View className="w-full flex-col items-start justify-start gap-3 rounded-lg bg-accent-50 px-4 py-6">
              <ThemedText
                variant="caption"
                weight="normal"
                color="muted"
                underline
              >
                {["speakerdeck.com"]}
              </ThemedText>
              <ThemedText
                variant="body"
                weight="semibold"
                color="default"
                numberOfLines={2}
              >
                {[
                  "ドメイン駆動設計の実践により事業の成長スピードと保守性を両立するショッピングクーポン",
                ]}
              </ThemedText>
              <View className="flex-col items-start justify-start gap-1">
                <ThemedText variant="body" weight="semibold" color="accent">
                  {["description"]}
                </ThemedText>
                <ThemedText variant="body" weight="normal" color="default">
                  {[
                    "ドメイン駆動設計の実践により事業の成長スピードと保守性を両立するショッピングクーポン",
                  ]}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
        onSwipedLeft={() => console.log("左にスワイプ")}
        onSwipedRight={() => console.log("右にスワイプ")}
        onSwipedAll={() => setIsFinished(true)}
        cardIndex={0}
        backgroundColor="#ffffff"
        stackSize={3}
        stackSeparation={-25}
        stackScale={5}
      />
    </View>
  );
}

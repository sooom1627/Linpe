import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Ionicons } from "@expo/vector-icons";

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
  const swiperRef = useRef<Swiper<(typeof DUMMY_CARDS)[number]>>(null);

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
    <View className="relative flex-1 flex-col items-center justify-center">
      <View className="absolute top-16 h-fit w-full items-center justify-center">
        <Swiper
          ref={swiperRef}
          cards={cards}
          verticalSwipe={true}
          disableBottomSwipe={true}
          renderCard={() => (
            <View className="h-fit flex-col items-center justify-center gap-4 bg-white">
              <Image
                source={{
                  uri: "https://ph-static.imgix.net/ph-logo-1.png",
                }}
                className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-50"
              />
              <View className="h-42 w-full flex-col items-start justify-start gap-3 rounded-lg bg-accent-50 px-4 py-6">
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
          onSwipedTop={() => console.log("上にスワイプ")}
          onSwipedAll={() => setIsFinished(true)}
          cardIndex={0}
          backgroundColor="#ffffff"
          stackSize={3}
          stackSeparation={-25}
          stackScale={5}
        />
      </View>
      <View className="absolute bottom-8 flex w-full flex-row justify-center gap-4 px-4 py-4">
        <TouchableOpacity
          onPress={() => swiperRef.current?.swipeLeft()}
          className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-500"
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current?.swipeBack()}
          className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-yellow-500"
        >
          <Ionicons name="star" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current?.swipeRight()}
          className="h-14 w-14 items-center justify-center rounded-full bg-green-500"
        >
          <Ionicons name="heart" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

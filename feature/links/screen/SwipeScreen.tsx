import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";

import { SwipeActions } from "../components/actions/SwipeActions";
import { LinkInfoCard } from "../components/cards/LinkInfoCard";
import { SwipeCardImage } from "../components/images/SwipeCardImage";
import { PaginationDots } from "../components/pagination/PaginationDots";
import { DUMMY_CARDS } from "../constants/dummy-data";
import { OVERLAY_LABELS } from "../constants/swipe";
import { type Card } from "../types/card";

export default function SwipeScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const [cards, setCards] = useState(DUMMY_CARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const swiperRef = useRef<Swiper<Card>>(null);

  const handleReload = () => {
    setCards(DUMMY_CARDS);
    setIsFinished(false);
    setCurrentCardIndex(0);
  };

  if (isFinished) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 text-xl font-medium text-gray-800">
          You&apos;ve seen all cards
        </Text>
        <TouchableOpacity
          onPress={handleReload}
          className="rounded-xl bg-accent px-8 py-4"
        >
          <Text className="text-base font-medium text-white">View Again</Text>
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
          overlayLabels={OVERLAY_LABELS}
          animateOverlayLabelsOpacity
          overlayOpacityHorizontalThreshold={30}
          overlayOpacityVerticalThreshold={30}
          backgroundColor="#ffffff"
          stackSize={3}
          stackSeparation={-25}
          stackScale={5}
          renderCard={(card) => (
            <View className="h-fit flex-col items-center justify-center gap-4 bg-transparent">
              <SwipeCardImage uri={card.imageUrl} title={card.title} />
            </View>
          )}
          onSwipedLeft={(index: number) => {
            setCurrentCardIndex(index + 1);
          }}
          onSwipedRight={(index: number) => {
            setCurrentCardIndex(index + 1);
          }}
          onSwipedTop={(index: number) => {
            setCurrentCardIndex(index + 1);
          }}
          onSwiped={(index: number) => {
            setCurrentCardIndex(index + 1);
          }}
          onSwipedAll={() => setIsFinished(true)}
        />
      </View>

      <View className="h-42 absolute top-2/4 w-full flex-col items-start justify-start gap-3 rounded-lg px-6">
        <LinkInfoCard
          domain={["speakerdeck.com"]}
          title={cards[currentCardIndex]?.title || ""}
          description={cards[currentCardIndex]?.description || ""}
        />
      </View>

      <View className="absolute bottom-4 flex w-full flex-row justify-center gap-2 px-4 py-4">
        <PaginationDots
          totalCount={cards.length}
          currentIndex={currentCardIndex}
        />
      </View>

      <View className="absolute bottom-14 z-10 flex w-full flex-row justify-center gap-4 px-4 py-4">
        <SwipeActions
          onSwipeLeft={() => swiperRef.current?.swipeLeft()}
          onSwipeBack={() => {
            if (currentCardIndex > 0) {
              swiperRef.current?.swipeBack();
              setCurrentCardIndex((prev) => prev - 1);
            }
          }}
          onSwipeRight={() => swiperRef.current?.swipeRight()}
          canSwipeBack={currentCardIndex > 0}
        />
      </View>
    </View>
  );
}

import { useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";

import { SwipeActions } from "../components/actions/SwipeActions";
import { LinkInfoCard } from "../components/cards/LinkInfoCard";
import { SwipeFinishCard } from "../components/cards/SwipeFinishCard";
import { SwipeCardImage } from "../components/images/SwipeCardImage";
import { PaginationDots } from "../components/pagination/PaginationDots";
import { OVERLAY_LABELS } from "../constants/swipe";
import { useTopViewLinks } from "../hooks/useLinks";
import { useOGDataBatch } from "../hooks/useOGDataBatch";
import { type Card } from "../types/card";

export default function SwipeScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const swiperRef = useRef<Swiper<Card>>(null);

  const { links, isError, isLoading } = useTopViewLinks();
  const { dataMap, loading: ogLoading } = useOGDataBatch(
    links.map((link) => link.full_url),
  );

  const cards = useMemo<Card[]>(() => {
    if (!links || !dataMap) return [];
    return links.map((link, index) => {
      const ogData = dataMap[link.full_url];
      return {
        id: index,
        title: ogData?.title || link.full_url || "",
        description: ogData?.description || "",
        imageUrl: ogData?.image || "",
      };
    });
  }, [links, dataMap]);

  const handleReload = () => {
    setIsFinished(false);
    setCurrentCardIndex(0);
  };

  const handleSwipe = (index: number) => {
    setCurrentCardIndex(index + 1);
  };

  if (isLoading || ogLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading data</Text>
      </View>
    );
  }

  if (isFinished) {
    return <SwipeFinishCard onReload={handleReload} />;
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
          onSwipedLeft={handleSwipe}
          onSwipedRight={handleSwipe}
          onSwipedTop={handleSwipe}
          onSwiped={handleSwipe}
          onSwipedAll={() => setIsFinished(true)}
        />
      </View>

      <View className="h-42 absolute top-2/4 w-full flex-col items-start justify-start gap-3 rounded-lg px-6">
        <LinkInfoCard
          domain={
            cards[currentCardIndex]?.imageUrl
              ? [new URL(cards[currentCardIndex].imageUrl).hostname]
              : []
          }
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

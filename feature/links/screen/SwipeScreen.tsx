import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { SwipeActions } from "../components/actions/SwipeActions";
import { LinkInfoCard } from "../components/cards/LinkInfoCard";
import { SwipeFinishCard } from "../components/cards/SwipeFinishCard";
import { SwipeCardImage } from "../components/images/SwipeCardImage";
import { SwipeDirectionOverlay } from "../components/overlay/SwipeDirectionOverlay";
import { PaginationDots } from "../components/pagination/PaginationDots";
import {
  SwipeEmptyState,
  SwipeErrorState,
  SwipeLoadingState,
} from "../components/states/SwipeStates";
import { useGetLinks } from "../hooks/useLinks";
import { useOGDataBatch } from "../hooks/useOGDataBatch";
import { type Card } from "../types/card";
import { createBackgroundStyle } from "../utils/swipeAnimations";
import { createSwipeHandlers } from "../utils/swipeHandlers";

export default function SwipeScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<Swiper<Card>>(null);
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | "top" | null
  >(null);

  const { links, isError, isLoading } = useGetLinks(20, "swipe");
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
    setActiveIndex(0);
  };

  const {
    handleSwiping,
    handleSwipedAborted,
    handleSwiped,
    handleSwipedAll,
    handleTapCard,
    handleSwipeButtonPress,
  } = createSwipeHandlers({
    setSwipeDirection,
    setActiveIndex,
    setIsFinished,
    swiperRef,
  });

  const backgroundStyle = useAnimatedStyle(() =>
    createBackgroundStyle(swipeDirection),
  );

  if (isLoading || ogLoading) {
    return <SwipeLoadingState />;
  }

  if (isError) {
    return <SwipeErrorState />;
  }

  if (links.length === 0) {
    return <SwipeEmptyState />;
  }

  if (isFinished) {
    return <SwipeFinishCard onReload={handleReload} />;
  }

  const activeCard = cards[activeIndex];

  return (
    <View className="relative flex-1 flex-col items-center justify-center">
      <Animated.View style={backgroundStyle} />
      <View className="absolute top-16 h-fit w-full items-center justify-center">
        <SwipeDirectionOverlay direction={swipeDirection} />
        <Swiper
          ref={swiperRef}
          cards={cards}
          verticalSwipe={true}
          disableBottomSwipe={true}
          animateOverlayLabelsOpacity
          overlayOpacityHorizontalThreshold={15}
          overlayOpacityVerticalThreshold={15}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={-25}
          stackScale={5}
          onSwiping={handleSwiping}
          onSwipedAborted={handleSwipedAborted}
          onSwiped={handleSwiped}
          onSwipedAll={handleSwipedAll}
          onTapCard={handleTapCard}
          renderCard={(card) => (
            <View className="h-fit flex-col items-center justify-center gap-4 bg-transparent">
              <SwipeCardImage uri={card.imageUrl} title={card.title} />
            </View>
          )}
        />
      </View>

      <View className="absolute bottom-56 h-40 w-full flex-col items-start justify-start gap-3 rounded-lg px-6">
        <LinkInfoCard
          domain={
            activeCard?.imageUrl ? [new URL(activeCard.imageUrl).hostname] : []
          }
          title={activeCard?.title || ""}
          description={activeCard?.description || ""}
        />
      </View>
      <View className="absolute bottom-24 z-10 flex w-full flex-row justify-center gap-4 px-4 py-4">
        <SwipeActions
          onSwipeLeft={() => handleSwipeButtonPress("left")}
          onSwipeRight={() => handleSwipeButtonPress("right")}
          onSwipeTop={() => handleSwipeButtonPress("top")}
        />
      </View>
      <View className="absolute bottom-14 flex w-full flex-row justify-center gap-2 px-4 py-4">
        <PaginationDots totalCount={cards.length} currentIndex={activeIndex} />
      </View>
    </View>
  );
}

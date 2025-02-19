import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated from "react-native-reanimated";

import { useGetLinks, useOGDataBatch } from "@/feature/links/application/hooks";
import { cardService } from "@/feature/links/application/service/cardService";
import { type Card } from "@/feature/links/domain/models/types";
import {
  CardImage,
  ErrorStatus,
  LinkInfoCard,
  LoadingStatus,
  NoLinksStatus,
  PaginationDots,
  SwipeFinishCard,
} from "@/feature/links/presentation/components/display";
import { SwipeActions } from "@/feature/links/presentation/components/input";
import { SwipeDirectionOverlay } from "@/feature/links/presentation/components/overlay";
import {
  swipeInteractions,
  type SwipeDirection,
} from "@/feature/links/presentation/interactions/swipe";
import { createBackgroundStyle } from "@/feature/links/presentation/interactions/swipe/animations";

export default function SwipeScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<Swiper<Card>>(null);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);

  const { links, isError, isLoading } = useGetLinks(20, "swipe");
  const { dataMap, loading: ogLoading } = useOGDataBatch(
    links?.length > 0 ? links.map((link) => link.full_url) : [],
  );

  const cards = useMemo<Card[]>(() => {
    if (!links || !dataMap) return [];
    return cardService.createCards(links, dataMap);
  }, [links, dataMap]);

  const backgroundStyle = createBackgroundStyle(swipeDirection);

  const handleReload = () => {
    setIsFinished(false);
    setActiveIndex(0);
  };
  const handleSwipedAborted = () => {
    setSwipeDirection(null);
  };

  const handleSwiping = (x: number, y: number) => {
    const direction = swipeInteractions.calculateSwipeDirection(x, y);
    setSwipeDirection(direction);
  };

  const handleSwiped = (cardIndex: number) => {
    const newState = swipeInteractions.handleCardIndexChange(
      cardIndex,
      cards.length,
    );
    if (typeof newState.activeIndex === "number") {
      setActiveIndex(newState.activeIndex);
    }
    if (newState.isFinished) {
      setIsFinished(true);
    }
    setSwipeDirection(null);
  };

  const handleSwipedAll = () => {
    setSwipeDirection(null);
    setIsFinished(true);
  };

  const handleTapCard = () => {
    setSwipeDirection(null);
  };

  const handleSwipeButtonPress = (direction: SwipeDirection) => {
    if (!direction) return;

    setSwipeDirection(direction);
    switch (direction) {
      case "left":
        swiperRef.current?.swipeLeft();
        break;
      case "right":
        swiperRef.current?.swipeRight();
        break;
      case "top":
        swiperRef.current?.swipeTop();
        break;
    }
  };

  if (isLoading || ogLoading) {
    return <LoadingStatus />;
  }

  if (links?.length === 0) {
    return <NoLinksStatus />;
  }

  if (isError) {
    return <ErrorStatus />;
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
              <CardImage uri={card.imageUrl} title={card.title} />
            </View>
          )}
        />
      </View>

      <View className="absolute bottom-56 h-40 w-full flex-col items-start justify-start gap-3 rounded-lg px-6">
        <LinkInfoCard
          domain={activeCard?.domain}
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

import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated from "react-native-reanimated";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import {
  useOGDataBatch,
  useSwipeScreenLinks,
} from "@/feature/links/application/hooks";
import {
  useSwipeActions,
  useSwipeState,
} from "@/feature/links/application/hooks/swipe";
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
import { createBackgroundStyle } from "@/feature/links/presentation/interactions/swipe/animations";
import { type SwipeDirection } from "@/feature/links/presentation/interactions/swipe/types";

interface SwipeScreenProps {
  resetOnFocus?: boolean;
  onResetComplete?: () => void;
}

export default function SwipeScreen({
  resetOnFocus = false,
  onResetComplete,
}: SwipeScreenProps) {
  const { session } = useSessionContext();
  const swiperRef = useRef<Swiper<Card>>(null);

  const {
    direction: swipeDirection,
    activeIndex,
    isFinished,
    setDirection,
    handleCardIndexChange,
    resetState,
  } = useSwipeState();

  const {
    links: userLinks,
    isError,
    isLoading,
    isEmpty,
  } = useSwipeScreenLinks(session?.user?.id ?? null);

  const { dataMap, loading: ogLoading } = useOGDataBatch(
    userLinks?.length > 0 ? userLinks.map((link) => link.full_url) : [],
  );

  const cards = useMemo<Card[]>(() => {
    if (!userLinks || !dataMap) return [];
    return cardService.createCards(userLinks, dataMap);
  }, [userLinks, dataMap]);

  // タブ切り替え時に状態をリセット
  useEffect(() => {
    if (resetOnFocus) {
      resetState();
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetOnFocus, resetState, onResetComplete]);

  const { handleSwiping, handleSwipeAborted, handleSwipeComplete } =
    useSwipeActions({
      userId: session?.user?.id ?? null,
      onDirectionChange: setDirection,
    });

  const backgroundStyle = createBackgroundStyle(swipeDirection);
  const activeCard = cards[activeIndex];

  const handleReload = () => {
    resetState();
  };

  const handleSwiped = async (cardIndex: number) => {
    handleCardIndexChange(cardIndex, cards.length);
    if (cards[cardIndex]) {
      await handleSwipeComplete(swipeDirection, cards[cardIndex]);
    }
  };

  const handleSwipeButtonPress = (direction: SwipeDirection) => {
    if (!direction) return;

    setDirection(direction);
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

  if (isEmpty) {
    return <NoLinksStatus />;
  }

  if (isError) {
    return <ErrorStatus />;
  }

  if (isFinished) {
    return <SwipeFinishCard onReload={handleReload} />;
  }

  return (
    <View className="relative flex-1 flex-col items-center justify-center">
      <Animated.View style={backgroundStyle} />
      <View className="absolute top-12 h-fit w-full items-center justify-center">
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
          onSwipedAborted={handleSwipeAborted}
          onSwiped={handleSwiped}
          onSwipedAll={() => setDirection(null)}
          onTapCard={() => setDirection(null)}
          renderCard={(card) => (
            <View className="h-fit flex-col items-center justify-center gap-4 bg-transparent">
              <CardImage uri={card.imageUrl} title={card.title} />
            </View>
          )}
        />
      </View>

      <View className="absolute bottom-60 h-40 w-full flex-col items-start justify-start gap-3 rounded-lg px-6">
        <LinkInfoCard
          domain={activeCard?.domain}
          title={activeCard?.title || ""}
          description={activeCard?.description || ""}
        />
      </View>
      <View className="absolute bottom-20 z-10 flex w-full flex-row justify-center gap-4 px-4 py-4">
        <SwipeActions
          onSwipeLeft={() => handleSwipeButtonPress("left")}
          onSwipeRight={() => handleSwipeButtonPress("right")}
          onSwipeTop={() => handleSwipeButtonPress("top")}
        />
      </View>
      <View className="absolute bottom-10 flex w-full flex-row justify-center gap-2 px-4 py-4">
        <PaginationDots totalCount={cards.length} currentIndex={activeIndex} />
      </View>
    </View>
  );
}

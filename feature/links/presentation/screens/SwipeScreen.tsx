import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated from "react-native-reanimated";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import {
  useLinkAction,
  useOGDataBatch,
  useUserLinks,
} from "@/feature/links/application/hooks";
import { cardService } from "@/feature/links/application/service/cardService";
import {
  type Card,
  type LinkActionStatus,
} from "@/feature/links/domain/models/types";
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
  const { session } = useSessionContext();
  const [isFinished, setIsFinished] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<Swiper<Card>>(null);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);

  const { userLinks, isError, isLoading } = useUserLinks(
    session?.user?.id ?? null,
    20,
    "swipe",
  );
  const { dataMap, loading: ogLoading } = useOGDataBatch(
    userLinks?.length > 0 ? userLinks.map((link) => link.full_url) : [],
  );

  const { updateLinkAction } = useLinkAction();

  const cards = useMemo<Card[]>(() => {
    if (!userLinks || !dataMap) return [];
    return cardService.createCards(userLinks, dataMap);
  }, [userLinks, dataMap]);

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

  const getStatusFromDirection = (
    direction: SwipeDirection,
  ): LinkActionStatus => {
    switch (direction) {
      case "left":
        return "inMonth";
      case "right":
        return "inWeekend";
      case "top":
        return "Today";
      default:
        return "add";
    }
  };

  const handleSwiped = async (cardIndex: number) => {
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

    if (!session?.user?.id || !cards[cardIndex]) {
      return;
    }

    try {
      const status = getStatusFromDirection(swipeDirection);
      const response = await updateLinkAction(
        session.user.id,
        cards[cardIndex].link_id,
        status,
        cards[cardIndex].swipe_count,
      );

      if (!response.success) {
        console.error("Failed to update link action:", response.error);
      }
    } catch (err) {
      console.error("Error in handleSwiped:", err);
    } finally {
      setSwipeDirection(null);
    }
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

  if (userLinks?.length === 0) {
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

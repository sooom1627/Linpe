import { useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useGetLinks, useOGDataBatch } from "@/feature/links/application/hooks";
import { SwipeActions } from "../../components/actions/SwipeActions";
import { LinkInfoCard } from "../../components/cards/LinkInfoCard";
import { SwipeFinishCard } from "../../components/cards/SwipeFinishCard";
import { SwipeCardImage } from "../../components/images/SwipeCardImage";
import { SwipeDirectionOverlay } from "../../components/overlay/SwipeDirectionOverlay";
import { PaginationDots } from "../../components/pagination/PaginationDots";
import { OVERLAY_BACKGROUND_COLORS } from "../../domain/constants";
import { type Card } from "../../domain/models/types";

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

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = swipeDirection
      ? OVERLAY_BACKGROUND_COLORS[swipeDirection]
      : "transparent";
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: -10,
      backgroundColor,
      opacity: withSpring(swipeDirection ? 1 : 0),
      zIndex: -10,
    };
  });

  const handleSwiping = (x: number, y: number) => {
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 15) {
      setSwipeDirection(x > 0 ? "right" : "left");
    } else if (y < -15) {
      setSwipeDirection("top");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleSwipedAborted = () => {
    setSwipeDirection(null);
  };

  const handleSwiped = (cardIndex: number) => {
    setSwipeDirection(null);
    setActiveIndex(cardIndex + 1);
  };

  const handleSwipedAll = () => {
    setSwipeDirection(null);
    setIsFinished(true);
  };

  const handleTapCard = () => {
    setSwipeDirection(null);
  };

  const handleSwipeButtonPress = (direction: "left" | "right" | "top") => {
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

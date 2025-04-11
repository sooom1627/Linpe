import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
  type ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import iconImage from "@/assets/images/icon.png";
import noLinksImage from "@/assets/images/noLinks.png";
import reactLogoImage from "@/assets/images/react-logo.png";
import { ThemedText } from "@/components/text/ThemedText";
import { useOnboardingStatus } from "@/shared/onboarding";

// 既存の画像を使用
const slides = [
  {
    id: "1",
    image: iconImage,
    title: "繋がりを拡げて、繋がりを深める",
    subtitle:
      "Yentaは、新しい出会いと既存のつながりとの再会のきっかけを提供するビジネスSNSです。",
  },
  {
    id: "2",
    image: reactLogoImage,
    title: "あなたのビジネスネットワークを強化",
    subtitle:
      "専門知識の共有やビジネスチャンスの発見など、プロフェッショナルな関係を構築できます。",
  },
  {
    id: "3",
    image: noLinksImage,
    title: "始めましょう",
    subtitle:
      "あなたのキャリアを次のレベルに引き上げる新しい可能性を発見しましょう。",
  },
];

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

// 画面の幅を取得
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const { setCompleted } = useOnboardingStatus();

  // オンボーディングを完了としてマーク
  const completeOnboarding = useCallback(async () => {
    if (isCompleting) return; // 二重実行防止

    setIsCompleting(true);

    try {
      const success = await setCompleted();

      if (success) {
        router.replace("/(auth)/loginScreen");
      } else {
        console.error("[DEBUG] Failed to save onboarding status properly");
      }
    } catch (error) {
      console.error("[DEBUG] Error in completeOnboarding:", error);
    } finally {
      setIsCompleting(false);
    }
  }, [router, isCompleting, setCompleted]);

  // 次のスライドに進む
  const goToNextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  }, [currentIndex, completeOnboarding]);

  // スキップ処理
  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // 各スライドのレンダリング
  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => {
    return (
      <View
        style={{ width: SCREEN_WIDTH }}
        className="items-center justify-center px-8"
      >
        <Image
          source={item.image}
          resizeMode="contain"
          style={{ height: SCREEN_WIDTH * 0.8, width: SCREEN_WIDTH * 0.8 }}
          className="mx-auto"
        />
        <View className="mt-10 px-5">
          <ThemedText
            text={item.title}
            variant="h3"
            weight="bold"
            className="mb-4 text-center"
          />
          <ThemedText
            text={item.subtitle}
            variant="body"
            className="text-center text-gray-600"
          />
        </View>
      </View>
    );
  };

  // ページ変更時の処理
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: ViewableItemsChanged) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  // ページインジケーターのレンダリング
  const renderPagination = () => {
    return (
      <View className="mb-10 flex-row justify-center">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`mx-1 h-2 rounded ${
              index === currentIndex ? `w-5 bg-blue-500` : `w-2 bg-gray-300`
            }`}
          />
        ))}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* スキップボタン（最後のスライド以外で表示） */}
      {!isLastSlide && (
        <TouchableOpacity
          className="absolute right-5 top-5 z-10"
          onPress={handleSkip}
          disabled={isCompleting}
        >
          <ThemedText
            text="スキップ"
            variant="small"
            className="text-gray-500"
          />
        </TouchableOpacity>
      )}

      {/* スライド表示 */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 200,
        }}
        keyExtractor={(item) => item.id}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
        className="flex-1"
      />

      {/* ページネーションドット */}
      {renderPagination()}

      {/* 次へボタン/始めるボタン */}
      <TouchableOpacity
        className="mb-8 self-center rounded-full bg-blue-500 px-10 py-4"
        onPress={goToNextSlide}
        disabled={isCompleting}
      >
        <ThemedText
          text={isLastSlide ? "始める" : "次へ"}
          variant="body"
          weight="semibold"
          className="text-white"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

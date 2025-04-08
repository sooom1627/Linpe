import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import iconImage from "@/assets/images/icon.png";
import noLinksImage from "@/assets/images/noLinks.png";
import reactLogoImage from "@/assets/images/react-logo.png";
import { ThemedText } from "@/components/text/ThemedText";

const { width } = Dimensions.get("window");

// オンボーディングが完了したかどうかを保存するキー
export const ONBOARDING_COMPLETE_KEY = "hasCompletedOnboarding";

// 色の定数
const COLORS = {
  WHITE: "white",
  PRIMARY: "#3b82f6",
  DOT_INACTIVE: "#ccc",
};

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

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // 起動時に現在のオンボーディング状態を確認（デバッグ用）
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        console.log(`[DEBUG] Current onboarding status: ${value}`);
      } catch (error) {
        console.error("[DEBUG] Failed to get onboarding status:", error);
      }
    };
    checkStatus();
  }, []);

  // オンボーディングを完了としてマーク
  const completeOnboarding = useCallback(async () => {
    if (isCompleting) return; // 二重実行防止

    setIsCompleting(true);
    console.log("[DEBUG] Marking onboarding as completed...");

    try {
      // 明示的に文字列としてtrueを保存
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");

      // 保存できたか確認
      const savedValue = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      console.log(`[DEBUG] Saved onboarding status: ${savedValue}`);

      if (savedValue === "true") {
        console.log(
          "[DEBUG] Successfully saved onboarding status, navigating to login screen",
        );
        router.replace("/(auth)/loginScreen");
      } else {
        console.error("[DEBUG] Failed to save onboarding status properly");
      }
    } catch (error) {
      console.error("[DEBUG] Error in completeOnboarding:", error);
    } finally {
      setIsCompleting(false);
    }
  }, [router, isCompleting]);

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
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.textContainer}>
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
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* スキップボタン（最後のスライド以外で表示） */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
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
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
      />

      {/* ページネーションドット */}
      {renderPagination()}

      {/* 次へボタン/始めるボタン */}
      <TouchableOpacity
        style={styles.nextButton}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  image: {
    height: width * 0.8,
    resizeMode: "contain",
    width: width * 0.8,
  },
  nextButton: {
    alignSelf: "center",
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 30,
    marginBottom: 30,
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  paginationDot: {
    backgroundColor: COLORS.DOT_INACTIVE,
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
  paginationDotActive: {
    backgroundColor: COLORS.PRIMARY,
    width: 20,
  },
  skipButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 10,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    width,
  },
  textContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
});

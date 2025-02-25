import { useCallback, useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Slot, useRouter } from "expo-router";

interface BottomSheetProps {
  screenOptions?: {
    snapPoints?: number[];
    initialSnapPoint?: number;
    backdropOpacity?: number;
    borderRadius?: number;
    handleIndicatorStyle?: object;
    handleStyle?: object;
    contentContainerStyle?: object;
  };
}

export function BottomSheet({ screenOptions = {} }: BottomSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  // デフォルト値の設定
  const snapPoints = useMemo(
    () => screenOptions.snapPoints || [0.25, 0.5, 0.9],
    [screenOptions.snapPoints],
  );
  const initialSnapPoint = screenOptions.initialSnapPoint ?? 1;
  const backdropOpacity = screenOptions.backdropOpacity ?? 0.5;
  const borderRadius = screenOptions.borderRadius ?? 24;

  // シートの位置を格納するAnimated値
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const active = useSharedValue(false);
  const scrollY = useSharedValue(0);
  const scrollLock = useSharedValue(false);

  // スクロールの参照とハンドラー
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollEnabled = !active.value;

  // スクロールハンドラー
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // 最大値の計算（画面高さの割合）
  const MAX_TRANSLATE_Y = SCREEN_HEIGHT;
  const MIN_TRANSLATE_Y = SCREEN_HEIGHT * (1 - Math.max(...snapPoints));

  // ボトムシートを閉じる関数
  const closeSheet = useCallback(() => {
    translateY.value = withSpring(MAX_TRANSLATE_Y, {
      damping: 50,
      stiffness: 300,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    });
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      }
    }, 200);
  }, [router, translateY, MAX_TRANSLATE_Y]);

  // ジェスチャー制御
  const gesture = Gesture.Pan()
    .onStart(() => {
      active.value = true;
    })
    .onUpdate((event) => {
      // 上下へのドラッグ処理
      if (!scrollLock.value) {
        translateY.value = Math.max(
          MIN_TRANSLATE_Y,
          Math.min(MAX_TRANSLATE_Y, translateY.value + event.translationY),
        );
      }

      // スクロール制御
      if (event.translationY < 0) {
        // 上にスワイプ中
        if (translateY.value <= MIN_TRANSLATE_Y && !scrollLock.value) {
          scrollLock.value = true;
        }
      } else {
        // 下にスワイプ中
        if (scrollY.value <= 0 || translateY.value > MIN_TRANSLATE_Y) {
          scrollLock.value = false;
        }
      }
    })
    .onEnd((_event) => {
      // スワイプ終了時、最も近いスナップポイントに移動
      if (translateY.value > SCREEN_HEIGHT * 0.7) {
        // 閉じる
        runOnJS(closeSheet)();
      } else {
        // 最も近いスナップポイントを見つける
        const snapPointsPixels = snapPoints.map(
          (point) => SCREEN_HEIGHT * (1 - point),
        );
        let closestPoint = snapPointsPixels[0];

        for (const point of snapPointsPixels) {
          if (
            Math.abs(translateY.value - point) <
            Math.abs(translateY.value - closestPoint)
          ) {
            closestPoint = point;
          }
        }

        translateY.value = withSpring(closestPoint, {
          damping: 50,
          stiffness: 300,
          mass: 0.8,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        });
      }

      scrollLock.value = false;
      active.value = false;
    });

  // 背景のアニメーションスタイル
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [MIN_TRANSLATE_Y, MAX_TRANSLATE_Y],
        [backdropOpacity, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  // シートのアニメーションスタイル
  const sheetAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // 初期表示時の設定
  useEffect(() => {
    // 初期スナップポイントの設定
    const initialPosition = SCREEN_HEIGHT * (1 - snapPoints[initialSnapPoint]);
    translateY.value = withSpring(initialPosition, {
      damping: 50,
      stiffness: 300,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    });
  }, [snapPoints, initialSnapPoint, translateY, SCREEN_HEIGHT]);

  return (
    <View className="flex-1">
      {/* 背景のオーバーレイ */}
      <Animated.View
        className="absolute inset-0 z-10 bg-black/50"
        style={backdropAnimatedStyle}
        onTouchEnd={closeSheet}
      />

      {/* ボトムシート */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          className="absolute left-0 right-0 top-0 z-20 bg-white"
          style={[
            {
              height: SCREEN_HEIGHT,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              paddingBottom: insets.bottom,
            },
            sheetAnimatedStyle,
            screenOptions.contentContainerStyle,
          ]}
        >
          {/* ハンドルインジケーター */}
          <View
            className="items-center py-2.5"
            style={screenOptions.handleStyle}
          >
            <View
              className="h-1 w-10 rounded-full bg-gray-300"
              style={screenOptions.handleIndicatorStyle}
            />
          </View>

          {/* コンテンツ */}
          <Animated.ScrollView
            ref={scrollViewRef}
            scrollEnabled={scrollEnabled}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Slot />
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

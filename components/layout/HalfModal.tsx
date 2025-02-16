import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type HalfModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const SWIPE_THRESHOLD = 50;

export const HalfModal = ({ isOpen, onClose, children }: HalfModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.5; // 画面の半分の高さ
  const translateY = useSharedValue(modalHeight);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SWIPE_THRESHOLD) {
        translateY.value = withSpring(
          modalHeight,
          {
            damping: 20,
            stiffness: 200,
          },
          () => {
            runOnJS(setIsVisible)(false);
            runOnJS(onClose)();
          },
        );
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateY.value, [0, modalHeight], [1, 0]),
    };
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        reduceMotion: ReduceMotion.Never,
        overshootClamping: true,
      });
    } else {
      translateY.value = withSpring(
        modalHeight,
        {
          damping: 20,
          stiffness: 200,
          reduceMotion: ReduceMotion.Never,
          overshootClamping: true,
        },
        () => {
          runOnJS(setIsVisible)(false);
        },
      );
    }
  }, [isOpen, modalHeight, translateY]);

  if (!isVisible) return null;

  return (
    <GestureHandlerRootView className="absolute inset-0 z-50 flex-1 items-center bg-transparent">
      <Animated.View
        className="absolute inset-0 bg-black/50"
        style={rBackdropStyle}
      >
        <TouchableOpacity
          className="h-full w-full"
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          className="absolute bottom-4 left-3 right-3 min-h-72 rounded-2xl bg-white"
          style={rStyle}
        >
          <View className="my-2 h-1 w-12 self-center rounded-full bg-gray-300" />
          <View className="flex-1 px-4 py-6">{children}</View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

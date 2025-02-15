import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
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
import Toast from "react-native-toast-message";

import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";

type SlideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const SWIPE_THRESHOLD = 50;

export const SlideModal = ({
  isOpen,
  onClose,
  title,
  children,
}: SlideModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { width } = Dimensions.get("window");
  const translateX = useSharedValue(width);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(
          width,
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
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, width], [1, 0]),
    };
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        reduceMotion: ReduceMotion.Never,
        overshootClamping: true,
      });
    } else {
      translateX.value = withSpring(
        width,
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
  }, [isOpen, width, translateX]);

  if (!isVisible) return null;

  return (
    <GestureHandlerRootView className="absolute inset-0 z-50 flex-1">
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
          className="absolute right-0 top-0 h-full w-full bg-white"
          style={rStyle}
        >
          <View className="flex-1">
            <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
              <TouchableOpacity
                onPress={onClose}
                className="mr-4"
                activeOpacity={0.7}
              >
                <ChevronLeftIcon />
              </TouchableOpacity>
              <Text className="text-xl font-bold">{title}</Text>
            </View>
            <View className="flex-1 p-4">{children}</View>
          </View>
        </Animated.View>
      </GestureDetector>
      <Toast />
    </GestureHandlerRootView>
  );
};

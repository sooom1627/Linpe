import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { SignoutButton } from "@/feature/auth/components";
import { useProfileEditModal } from "@/feature/user/contexts/ProfileEditModalContext";
import { ThemedText } from "../../text/ThemedText";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MENU_WIDTH = 280;
const SWIPE_THRESHOLD = 50;

export const SideMenu = ({ isOpen, onClose }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useProfileEditModal();
  const translateX = useSharedValue(MENU_WIDTH);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(
          MENU_WIDTH,
          {
            damping: 20,
            stiffness: 200,
            reduceMotion: ReduceMotion.Never,
            overshootClamping: true,
          },
          () => {
            runOnJS(onClose)();
          },
        );
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          reduceMotion: ReduceMotion.Never,
          overshootClamping: true,
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
      opacity: interpolate(translateX.value, [0, MENU_WIDTH], [0.3, 0]),
    };
  });

  const closeMenu = useCallback(() => {
    translateX.value = withSpring(
      MENU_WIDTH,
      {
        damping: 20,
        stiffness: 200,
        reduceMotion: ReduceMotion.Never,
        overshootClamping: true,
      },
      () => {
        runOnJS(setIsVisible)(false);
        runOnJS(onClose)();
      },
    );
  }, [onClose, translateX]);

  const openMenu = useCallback(() => {
    setIsVisible(true);
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 200,
      reduceMotion: ReduceMotion.Never,
      overshootClamping: true,
    });
  }, [translateX]);

  useEffect(() => {
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  if (!isVisible && !isOpen) return null;

  return (
    <GestureHandlerRootView className="absolute right-0 top-0 z-50 h-full w-full">
      <Animated.View
        className="absolute h-full w-full bg-black"
        style={rBackdropStyle}
      >
        <TouchableOpacity
          className="h-full w-full"
          onPress={closeMenu}
          activeOpacity={1}
        />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          className="absolute right-0 h-full bg-white"
          style={[
            {
              width: MENU_WIDTH,
            },
            rStyle,
          ]}
        >
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between gap-2">
              <ThemedText variant="h4" weight="semibold">
                {["Menu"]}
              </ThemedText>
              <TouchableOpacity onPress={closeMenu} className="">
                <CloseIcon size={16} />
              </TouchableOpacity>
            </View>
            <View className="mt-8 flex gap-2">
              <TouchableOpacity
                className="flex-row items-center justify-between gap-2 py-2"
                onPress={() => {
                  openModal();
                  closeMenu();
                }}
              >
                <ThemedText variant="body" weight="medium">
                  {["Profile Edit"]}
                </ThemedText>
                <ChevronRightIcon size={16} />
              </TouchableOpacity>
              <SignoutButton onSignout={closeMenu} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

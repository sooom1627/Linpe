import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, PanResponder, TouchableOpacity, View } from "react-native";

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
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useProfileEditModal();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 0 && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          closeMenu();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      },
    }),
  ).current;

  const closeMenu = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: MENU_WIDTH,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => {
      setIsVisible(false);
      onClose();
    });
  }, [slideAnim, onClose]);

  const openMenu = useCallback(() => {
    setIsVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [slideAnim]);

  useEffect(() => {
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  if (!isVisible && !isOpen) return null;

  return (
    <View className="absolute right-0 top-0 z-50 h-full w-full">
      <Animated.View
        className="absolute h-full w-full bg-black"
        style={{
          opacity: slideAnim.interpolate({
            inputRange: [0, MENU_WIDTH],
            outputRange: [0.3, 0],
          }),
        }}
      >
        <TouchableOpacity
          className="h-full w-full"
          onPress={closeMenu}
          activeOpacity={1}
        />
      </Animated.View>
      <Animated.View
        className="absolute right-0 h-full bg-white"
        style={{
          width: MENU_WIDTH,
          transform: [{ translateX: slideAnim }],
        }}
        {...panResponder.panHandlers}
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
          <View className="mt-8 flex gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-between gap-2"
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
    </View>
  );
};

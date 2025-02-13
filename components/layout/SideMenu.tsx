import { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

import { SignoutButton } from "@/feature/auth/components";
import { useProfileEditModal } from "@/feature/user/contexts/ProfileEditModalContext";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";
import { ThemedText } from "../text/ThemedText";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SideMenu = ({ isOpen, onClose }: Props) => {
  const { openModal } = useProfileEditModal();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }

    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (!isOpen) {
        setIsVisible(false);
      }
    });
  }, [isOpen, slideAnim]);

  const handleProfileEdit = () => {
    onClose();
    openModal();
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50 flex-1">
      <Animated.View
        className="absolute inset-0 bg-black/50"
        style={{
          opacity: slideAnim.interpolate({
            inputRange: [0, 300],
            outputRange: [1, 0],
          }),
        }}
      >
        <TouchableOpacity
          className="h-full w-full"
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      <Animated.View
        className="absolute right-0 top-0 h-full w-[300px] bg-white"
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <View className="p-6">
          <ThemedText variant="h4" weight="bold" color="default">
            {["Settings"]}
          </ThemedText>
          <View className="mt-6 gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-between py-1"
              onPress={handleProfileEdit}
            >
              <ThemedText variant="body" weight="normal" color="default">
                {["Profile edit"]}
              </ThemedText>
              <ChevronRightIcon />
            </TouchableOpacity>
            <SignoutButton />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

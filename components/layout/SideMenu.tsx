import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import { SignoutButton } from "@/feature/auth/components/SignoutButton";
import { useProfileEditModal } from "@/feature/user/contexts/ProfileEditModalContext";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";

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
          <Text className="mb-6 text-base font-bold">Settings</Text>
          <View className="gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-between py-1"
              onPress={handleProfileEdit}
            >
              <Text className="text-base">Profile edit</Text>
              <ChevronRightIcon />
            </TouchableOpacity>
            <SignoutButton />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

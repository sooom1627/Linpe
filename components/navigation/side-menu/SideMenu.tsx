import { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

import { SignoutButton } from "@/feature/auth/components";
import { useProfileEditModal } from "@/feature/user/contexts/ProfileEditModalContext";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { ThemedText } from "../../text/ThemedText";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SideMenu = ({ isOpen, onClose }: Props) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useProfileEditModal();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOpen, slideAnim]);

  if (!isVisible && !isOpen) return null;

  return (
    <View className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50">
      <Animated.View
        className="h-full w-72 bg-white px-6 py-4"
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <View className="flex-row items-center justify-between">
          <ThemedText variant="h4" weight="semibold">
            {["Menu"]}
          </ThemedText>
          <TouchableOpacity onPress={onClose}>
            <ChevronRightIcon />
          </TouchableOpacity>
        </View>
        <View className="mt-8 flex gap-4">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => {
              openModal();
              onClose();
            }}
          >
            <ThemedText variant="body" weight="medium">
              {["Profile Edit"]}
            </ThemedText>
          </TouchableOpacity>
          <SignoutButton onSignout={onClose} />
        </View>
      </Animated.View>
      <TouchableOpacity
        className="h-full flex-1"
        onPress={onClose}
        activeOpacity={1}
      />
    </View>
  );
};

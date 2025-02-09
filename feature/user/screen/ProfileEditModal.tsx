import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { useProfileEditModal } from "../contexts/ProfileEditModalContext";
import ProfileEditScreen from "./ProfileEditScreen";

export const ProfileEditModal = () => {
  const { isOpen, closeModal } = useProfileEditModal();
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

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
          onPress={closeModal}
          activeOpacity={1}
        />
      </Animated.View>
      <Animated.View
        className="absolute right-0 top-0 h-full w-full bg-white"
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <View className="flex-1">
          <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
            <TouchableOpacity
              onPress={closeModal}
              className="mr-4"
              activeOpacity={0.7}
            >
              <ChevronLeftIcon />
            </TouchableOpacity>
            <Text className="font-bold text-xl">Profile edit</Text>
          </View>
          <View className="flex-1 p-4">
            <ProfileEditScreen />
          </View>
        </View>
      </Animated.View>
      <Toast />
    </View>
  );
};

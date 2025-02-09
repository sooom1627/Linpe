import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SideMenu = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
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

  const menuItems = [
    { title: "ホーム", onPress: () => router.push("/") },
    { title: "ダッシュボード", onPress: () => router.push("/dashboard") },
    { title: "スワイプ", onPress: () => router.push("/swipe") },
    {
      title: "ログアウト",
      onPress: () => {
        /* TODO: ログアウト処理 */
      },
    },
  ];

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
          <Text className="mb-6 font-bold text-xl">メニュー</Text>
          <View className="gap-4">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                className="py-2"
              >
                <Text className="text-lg">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

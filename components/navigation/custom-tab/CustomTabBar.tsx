import { useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";

import { DashboardIcon } from "@/components/icons/DashboardIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { SwipeIcon } from "@/components/icons/SwipeIcon";
import { type MenuPath } from "@/components/navigation/bottom-menu/constants";

// カスタムタブバーコンポーネント
export function CustomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // パス名に基づいてアクティブなタブを判断
  const isHomeActive = pathname === "/" || pathname.includes("/home");
  const isSwipeActive = pathname.includes("/swipe");
  const isDashboardActive = pathname.includes("/dashboard");

  const handlePress = (path: MenuPath) => {
    router.replace(path);
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 z-50 flex-row items-center justify-between border-t border-zinc-200 bg-white px-14 py-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 8), // 最低8pxのパディングを確保
      }}
    >
      {/* ホームタブ */}
      <TabButton
        active={isHomeActive}
        icon={<HomeIcon active={isHomeActive} size={28} />}
        onPress={() => handlePress("/(protected)")}
      />

      {/* スワイプタブ */}
      <TabButton
        active={isSwipeActive}
        icon={<SwipeIcon active={isSwipeActive} size={28} />}
        onPress={() => handlePress("/(protected)/swipe")}
      />

      {/* ダッシュボードタブ */}
      <TabButton
        active={isDashboardActive}
        icon={<DashboardIcon active={isDashboardActive} size={28} />}
        onPress={() => handlePress("/(protected)/dashboard")}
      />
    </View>
  );
}

// タブボタンコンポーネント
interface TabButtonProps {
  active: boolean;
  icon: React.ReactNode;
  onPress: () => void;
}

function TabButton({ icon, onPress }: TabButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        className="flex h-14 w-14 items-center justify-center"
        style={{
          transform: [{ scale }],
        }}
      >
        {icon}
      </Animated.View>
    </Pressable>
  );
}

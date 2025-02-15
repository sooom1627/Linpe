import { useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

import { DashboardIcon } from "../icons/DashboardIcon";
import { HomeIcon } from "../icons/HomeIcon";
import { SwipeIcon } from "../icons/SwipeIcon";

type IconComponent = React.ComponentType<{ active: boolean; size?: number }>;

type MenuPath =
  | "/(protected)"
  | "/(protected)/swipe"
  | "/(protected)/dashboard";

interface MenuItem {
  path: MenuPath;
  Icon: IconComponent;
  matchPaths?: string[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    path: "/(protected)",
    Icon: HomeIcon,
    matchPaths: ["/", "/index"],
  },
  {
    path: "/(protected)/swipe",
    Icon: SwipeIcon,
    matchPaths: ["/swipe"],
  },
  {
    path: "/(protected)/dashboard",
    Icon: DashboardIcon,
    matchPaths: ["/dashboard"],
  },
];

export const BottomMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (path: MenuPath) => {
    router.replace(path);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white px-14 py-2">
      <View className="flex-row items-center justify-between">
        {MENU_ITEMS.map((item, index) => (
          <MenuIcon
            key={index}
            item={item}
            pathname={pathname}
            onPress={() => handlePress(item.path)}
          />
        ))}
      </View>
    </View>
  );
};

interface MenuIconProps {
  item: MenuItem;
  pathname: string;
  onPress: () => void;
}

const MenuIcon = ({ item, pathname, onPress }: MenuIconProps) => {
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
        <item.Icon
          active={item.matchPaths?.includes(pathname) ?? pathname === item.path}
          size={28}
        />
      </Animated.View>
    </Pressable>
  );
};

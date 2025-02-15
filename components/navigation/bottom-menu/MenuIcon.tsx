import { useRef } from "react";
import { Animated, Pressable } from "react-native";

import { type MenuItem } from "./constants";

interface MenuIconProps {
  item: MenuItem;
  pathname: string;
  onPress: () => void;
}

export const MenuIcon = ({ item, pathname, onPress }: MenuIconProps) => {
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

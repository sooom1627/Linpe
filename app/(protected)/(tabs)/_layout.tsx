import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs } from "expo-router";

import { DashboardIcon } from "@/components/icons/DashboardIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { SwipeIcon } from "@/components/icons/SwipeIcon";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // タブバーの高さを計算（基本の高さ + 安全領域の下部分）
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: "#E4E4E7",
          backgroundColor: "white",
          paddingHorizontal: 32,
          paddingTop: 16,
        },
        tabBarShowLabel: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon active={focused} size={28} />,
        }}
      />
      <Tabs.Screen
        name="swipe"
        options={{
          title: "Swipe",
          tabBarIcon: ({ focused }) => <SwipeIcon active={focused} size={28} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <DashboardIcon active={focused} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}

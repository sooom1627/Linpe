import { View } from "react-native";
import { usePathname, useRouter } from "expo-router";

import { DashboardIcon } from "../icons/DashboardIcon";
import { HomeIcon } from "../icons/HomeIcon";
import { SwipeIcon } from "../icons/SwipeIcon";

export const BottomMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 mx-12 rounded-full border border-zinc-200 bg-white px-14 py-4 shadow-md shadow-zinc-200">
      <View className="flex-row items-center justify-between gap-4">
        <View
          className="flex h-10 w-10 items-center justify-center"
          onTouchEnd={() => router.replace("/(protected)")}
        >
          <HomeIcon active={pathname === "/" || pathname === "/index"} />
        </View>
        <View
          className="flex h-10 w-10 items-center justify-center"
          onTouchEnd={() => router.replace("/(protected)/swipe")}
        >
          <SwipeIcon active={pathname === "/swipe"} />
        </View>
        <View
          className="flex h-10 w-10 items-center justify-center"
          onTouchEnd={() => router.replace("/(protected)/dashboard")}
        >
          <DashboardIcon active={pathname === "/dashboard"} />
        </View>
      </View>
    </View>
  );
};

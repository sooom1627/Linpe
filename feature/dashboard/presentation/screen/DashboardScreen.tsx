import { useMemo } from "react";
import { View } from "react-native";

import { ScreenTimeChart } from "../components";

export const DashboardScreen = () => {
  // スクリーンタイムのダミーデータ生成（7日分）
  const screenTimeData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return Array(7)
      .fill(0)
      .map((_, index) => ({
        day: days[index],
        add: Math.floor(Math.random() * 60), // 0-60分
        swipe: Math.floor(Math.random() * 45), // 0-45分
        read: Math.floor(Math.random() * 90), // 0-90分
      }));
  }, []);

  return (
    <View className="flex items-center justify-center gap-10 py-5">
      {/* スクリーンタイムチャート */}
      <View className="w-full px-4">
        <ScreenTimeChart title="Your Activity" data={screenTimeData} />
      </View>
    </View>
  );
};

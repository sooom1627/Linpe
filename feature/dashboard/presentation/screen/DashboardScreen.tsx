import { View } from "react-native";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { LinksOverview, SwipeOverview } from "../views/Overview";
import { WeeklyActivityChartView } from "../views/WeeklyActivityChartView";

export const DashboardScreen = () => {
  const { session } = useSession();
  const userId = session?.user?.id || "";

  return (
    <View className="flex items-center justify-center gap-4 px-4 py-5">
      {/* スクリーンタイムチャート */}
      <WeeklyActivityChartView />
      <LinksOverview userId={userId} />
      <SwipeOverview userId={userId} />
    </View>
  );
};

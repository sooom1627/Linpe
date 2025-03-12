import { ScrollView } from "react-native";

import { DashboardScreen } from "@/feature/dashboard/presentation/screen/DashboardScreen";

export default function Dashboard() {
  return (
    <ScrollView className="flex-1">
      <DashboardScreen />
    </ScrollView>
  );
}

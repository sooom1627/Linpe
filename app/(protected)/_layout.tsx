// app/(protected)/_layout.tsx
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

import { BottomMenu } from "@/components/layout/BottomMenu";
import { Header } from "@/components/layout/Header";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useAuthRedirect } from "@/feature/auth/hooks/useAuthRedirect";
import { UserProvider } from "@/feature/user/contexts/UserContext";

export default function ProtectedLayout() {
  const { session } = useSessionContext();
  useAuthRedirect(session);

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1 pb-20 pt-16">
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
              animationDuration: 0,
              contentStyle: {
                backgroundColor: "white",
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "ホーム",
              }}
            />
            <Stack.Screen
              name="swipe"
              options={{
                title: "スワイプ",
              }}
            />
            <Stack.Screen
              name="dashboard"
              options={{
                title: "ダッシュボード",
              }}
            />
          </Stack>
        </View>
        <BottomMenu />
      </View>
    </UserProvider>
  );
}

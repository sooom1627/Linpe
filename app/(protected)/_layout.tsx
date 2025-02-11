// app/(protected)/_layout.tsx
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

import { BottomMenu } from "@/components/layout/BottomMenu";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useAuthRedirect } from "@/feature/auth/hooks/useAuthRedirect";
import { ProfileEditModalProvider } from "@/feature/user/contexts/ProfileEditModalContext";
import { UserProvider } from "@/feature/user/contexts/UserContext";
import { ProfileEditModal } from "@/feature/user/screen/ProfileEditModal";

export default function ProtectedLayout() {
  const { session } = useSessionContext();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
      <ProfileEditModalProvider>
        <View className="flex-1 bg-white">
          <Header onMenuPress={() => setIsSideMenuOpen(true)} />
          <View className="mb-16 flex-1 pt-16">
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
          <SideMenu
            isOpen={isSideMenuOpen}
            onClose={() => setIsSideMenuOpen(false)}
          />
          <ProfileEditModal />
        </View>
      </ProfileEditModalProvider>
    </UserProvider>
  );
}

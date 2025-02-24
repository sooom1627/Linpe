// app/(protected)/_layout.tsx
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

import {
  HalfModalProvider,
  HalfModalRenderer,
} from "@/components/layout/half-modal";
import { BottomMenu } from "@/components/navigation/bottom-menu/BottomMenu";
import { Header } from "@/components/navigation/header/Header";
import { SideMenu } from "@/components/navigation/side-menu/SideMenu";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { useAuthRedirect } from "@/feature/auth/application/hooks/useAuthRedirect";
import { ProfileEditModalProvider } from "@/feature/user/contexts/ProfileEditModalContext";
import { UserProvider } from "@/feature/user/contexts/UserContext";
import { ProfileEditModal } from "@/feature/user/screen/ProfileEditModal";

/**
 * Renders the protected application layout.
 *
 * If no authenticated session is available, displays a centered loading indicator. Once authenticated, the component wraps the main interface with context providers for user state, profile editing modals, and half modal management. It then shows a header, a navigation stack with multiple screens, a bottom menu, a side menu, and modal components.
 */
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
        <HalfModalProvider>
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
            <HalfModalRenderer />
          </View>
        </HalfModalProvider>
      </ProfileEditModalProvider>
    </UserProvider>
  );
}

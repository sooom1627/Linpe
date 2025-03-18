// app/(protected)/_layout.tsx
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

// 新しい場所からコンポーネントをインポート
import { CustomHeader } from "@/components/navigation/custom-header/CustomHeader";
import { CustomTabBar } from "@/components/navigation/custom-tab/CustomTabBar";
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

  // カスタムヘッダーを返す関数
  const renderCustomHeader = () => {
    return <CustomHeader onMenuPress={() => setIsSideMenuOpen(true)} />;
  };

  return (
    <UserProvider>
      <ProfileEditModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1">
            {/* Stackコンポーネントをラップして下部にスペースを確保 */}
            <View className="mb-16 flex-1">
              <Stack
                screenOptions={{
                  // カスタムヘッダーを使うので標準ヘッダーを表示する
                  headerShown: true,
                  // ヘッダースタイルをカスタマイズ
                  header: renderCustomHeader,
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
            <CustomTabBar />
            <SideMenu
              isOpen={isSideMenuOpen}
              onClose={() => setIsSideMenuOpen(false)}
            />
            <ProfileEditModal />
          </View>
        </SafeAreaView>
      </ProfileEditModalProvider>
    </UserProvider>
  );
}

// app/(protected)/_layout.tsx
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

// 新しい場所からコンポーネントをインポート
import { CustomHeader } from "@/components/navigation/custom-header/CustomHeader";
import { CustomTabBar } from "@/components/navigation/custom-tab/CustomTabBar";
import { SideMenu } from "@/components/navigation/side-menu/SideMenu";
import { ProfileEditModalProvider } from "@/feature/user/contexts/ProfileEditModalContext";
import { UserProvider } from "@/feature/user/contexts/UserContext";
import { ProfileEditModal } from "@/feature/user/screen/ProfileEditModal";

/**
 * Renders the protected application layout.
 *
 * The component wraps the main interface with context providers for user state, profile editing modals.
 * It then shows a header, a navigation stack with multiple screens, a bottom menu, a side menu, and modal components.
 */
export default function ProtectedLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // カスタムヘッダーを返す関数
  const renderCustomHeader = () => {
    return <CustomHeader onMenuPress={() => setIsSideMenuOpen(true)} />;
  };

  // コンテンツエリア用のマージンスタイル
  const contentMarginStyle = {
    marginBottom: 56 + insets.bottom, // タブバーの高さ(56) + 下部のセーフエリア
  };

  // タブバー用のパディングスタイル
  const tabBarPaddingStyle = {
    paddingBottom: insets.bottom,
  };

  return (
    <UserProvider>
      <ProfileEditModalProvider>
        <View
          className="flex-1 bg-white"
          style={{
            // SafeAreaProviderから取得したinsetを直接適用
            paddingTop: insets.top,
          }}
        >
          <View className="flex-1">
            {/* Stackコンポーネントをラップ - 下部のタブバーの高さ + 下部のセーフエリアを確保 */}
            <View className="flex-1" style={contentMarginStyle}>
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
                    title: "Home",
                  }}
                />
                <Stack.Screen
                  name="swipe"
                  options={{
                    title: "Swipe",
                  }}
                />
                <Stack.Screen
                  name="dashboard"
                  options={{
                    title: "Dashboard",
                  }}
                />
              </Stack>
            </View>
            {/* CustomTabBarをセーフエリアを考慮した位置に配置 */}
            <View
              className="absolute bottom-0 left-0 right-0 bg-white"
              style={tabBarPaddingStyle}
            >
              <CustomTabBar />
            </View>
            <SideMenu
              isOpen={isSideMenuOpen}
              onClose={() => setIsSideMenuOpen(false)}
            />
            <ProfileEditModal />
          </View>
        </View>
      </ProfileEditModalProvider>
    </UserProvider>
  );
}

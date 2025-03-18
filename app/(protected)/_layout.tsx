// app/(protected)/_layout.tsx
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useSegments } from "expo-router";

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
  const segments = useSegments();

  // モーダル内のページかどうかを判定
  const isModalPage = segments.length > 1 && segments[1] === "modal";

  // カスタムヘッダーを返す関数
  const renderCustomHeader = () => {
    return <CustomHeader onMenuPress={() => setIsSideMenuOpen(true)} />;
  };

  // コンテンツエリア用のマージンスタイル
  const contentMarginStyle = {
    marginBottom: 56 + insets.bottom, // 常にタブバーの高さを考慮
  };

  // タブバー用のスタイル
  const tabBarStyle = {
    paddingBottom: insets.bottom,
    zIndex: isModalPage ? -1 : 1, // モーダルページではタブバーを背面に、通常ページでは前面に
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
                  animation: "fade",
                  animationDuration: 200,
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
                {/* Modal関連のスクリーンはmodal/_layout.tsxで定義 */}
                <Stack.Screen
                  name="modal"
                  options={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                />
              </Stack>
            </View>

            {/* タブバーは常に表示するが、zIndexで制御 */}
            <View
              className="absolute bottom-0 left-0 right-0 bg-white"
              style={tabBarStyle}
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

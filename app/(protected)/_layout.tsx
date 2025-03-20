// app/(protected)/_layout.tsx
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { CustomHeader } from "@/components/navigation/custom-header/CustomHeader";
import { SideMenu } from "@/components/navigation/side-menu/SideMenu";
import { ProfileEditModalProvider } from "@/feature/user/contexts/ProfileEditModalContext";
import { UserProvider } from "@/feature/user/contexts/UserContext";
import { ProfileEditModal } from "@/feature/user/screen/ProfileEditModal";

/**
 * Renders the protected application layout.
 *
 * The component wraps the main interface with context providers for user state, profile editing modals.
 * It then shows a header, a navigation stack with multiple screens, a side menu, and modal components.
 */
export default function ProtectedLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // カスタムヘッダーを返す関数
  const renderCustomHeader = () => {
    return <CustomHeader onMenuPress={() => setIsSideMenuOpen(true)} />;
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
              {/* 新しいタブナビゲーションへのリンク */}
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: true,
                }}
              />

              {/* リンクページ */}
              <Stack.Screen
                name="links"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
            </Stack>
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

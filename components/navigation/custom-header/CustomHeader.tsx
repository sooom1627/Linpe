import { TouchableOpacity, View } from "react-native";
import { usePathname } from "expo-router";

import { MenuIcon } from "@/components/icons/MenuIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { AvatarDisplay } from "@/feature/user/components";
import { useUserContext } from "@/feature/user/contexts/UserContext";

type Props = {
  onMenuPress: () => void;
};

export function CustomHeader({ onMenuPress }: Props) {
  const { user } = useUserContext();
  const pathname = usePathname();

  // デバッグ用
  console.log("Header pathname:", pathname);

  const getPageTitle = () => {
    // Protected領域のパス名に対応
    if (pathname.includes("/(protected)/dashboard")) {
      return "ダッシュボード";
    } else if (pathname.includes("/(protected)/swipe")) {
      return "スワイプ";
    } else if (
      pathname === "/(protected)" ||
      pathname === "/(protected)/index" ||
      pathname === "/(protected)/"
    ) {
      return null; // ホーム画面ではユーザー名を表示
    } else {
      return null;
    }
  };

  const pageTitle = getPageTitle();

  return (
    // 絶対位置から通常配置に変更
    <View className="h-16 flex-row items-center justify-between border-b border-zinc-200 bg-white px-4">
      <View className="flex-row items-center justify-center gap-4">
        <View className="h-10 w-10 rounded-full bg-gray-500">
          {user?.avatar_url && (
            <AvatarDisplay imagePath={user?.avatar_url} size={36} />
          )}
        </View>
        {pageTitle ? (
          <ThemedText text={pageTitle} variant="h4" weight="semibold" />
        ) : (
          <ThemedText
            text={`Hi, ${user?.username ?? "Guest"}`}
            variant="h4"
            weight="semibold"
          />
        )}
      </View>
      <TouchableOpacity
        className="flex-row items-center justify-center gap-4"
        onPress={onMenuPress}
      >
        <MenuIcon />
      </TouchableOpacity>
    </View>
  );
}

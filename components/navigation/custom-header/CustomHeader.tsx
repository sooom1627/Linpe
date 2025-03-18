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

  const getPageTitle = () => {
    // パス名に基づいてタイトルを決定
    if (pathname.includes("/dashboard")) {
      return "Dashboard";
    } else if (pathname.includes("/swipe")) {
      return "Swipe";
    } else if (pathname === "/" || pathname.includes("/home")) {
      return "home"; // ホーム画面の識別子
    } else {
      return ""; // 空文字列を返す
    }
  };

  const pageTitle = getPageTitle();

  return (
    <View className="h-16 flex-row items-center justify-between border-b border-zinc-200 bg-white px-4">
      <View className="flex-row items-center justify-center gap-4">
        <View className="h-10 w-10 rounded-full bg-gray-500">
          {user?.avatar_url && (
            <AvatarDisplay imagePath={user?.avatar_url} size={36} />
          )}
        </View>
        {pageTitle === "home" ? (
          <ThemedText
            text={`Hi, ${user?.username ?? "Guest"}`}
            variant="h4"
            weight="semibold"
          />
        ) : pageTitle ? (
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

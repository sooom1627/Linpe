import { Text, TouchableOpacity, View } from "react-native";
import { usePathname } from "expo-router";

import { AvatarDisplay } from "@/feature/user/components/AvatarDisplay";
import { useUserContext } from "@/feature/user/contexts/UserContext";
import { MenuIcon } from "../icons/MenuIcon";

type Props = {
  onMenuPress: () => void;
};

export const Header = ({ onMenuPress }: Props) => {
  const { user } = useUserContext();
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/swipe":
        return "Swipe";
      default:
        return null;
    }
  };

  const pageTitle = getPageTitle();

  return (
    <View className="items-left absolute left-0 right-0 top-0 z-50 h-16 flex-row justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <View className="flex-row items-center justify-center gap-4">
        <View className="h-10 w-10 rounded-full bg-gray-500">
          {user?.avatar_url && (
            <AvatarDisplay imagePath={user?.avatar_url} size={36} />
          )}
        </View>
        {pageTitle ? (
          <Text className="font-medium text-lg">{pageTitle}</Text>
        ) : (
          <Text className="font-medium text-lg">
            Hi, {user?.username ?? "Guest"}.
          </Text>
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
};

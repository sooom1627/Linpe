import { Text, View } from "react-native";

import { useUserContext } from "@/feature/user/contexts/UserContext";

export const Header = () => {
  const { user } = useUserContext();

  return (
    <View className="items-left justify-left absolute left-0 right-0 top-0 z-50 h-16 flex-row border-b border-zinc-200 bg-white px-6 py-4">
      <View className="flex-row items-center justify-center gap-4">
        <View className="h-10 w-10 rounded-full bg-gray-500"></View>
        <Text className="font-medium text-lg">
          Hi, {user?.username ?? "Guest"}.
        </Text>
      </View>
    </View>
  );
};

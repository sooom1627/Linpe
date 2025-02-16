import { View } from "react-native";
import { usePathname, useRouter } from "expo-router";

import { MENU_ITEMS, type MenuPath } from "./constants";
import { MenuIcon } from "./MenuIcon";

export const BottomMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (path: MenuPath) => {
    router.replace(path);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white px-14 py-3">
      <View className="flex-row items-center justify-between">
        {MENU_ITEMS.map((item, index) => (
          <MenuIcon
            key={index}
            item={item}
            pathname={pathname}
            onPress={() => handlePress(item.path)}
          />
        ))}
      </View>
    </View>
  );
};

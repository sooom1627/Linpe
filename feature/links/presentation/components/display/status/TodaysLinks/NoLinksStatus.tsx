import { Image, View } from "react-native";
import { router } from "expo-router";

import noLinksImage from "@/assets/images/noLinks.png";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";

export const TodaysLinksNoStatus = () => {
  const openBottomSheet = () => {
    router.push("/bottom-sheet/link-input");
  };
  return (
    <View className="flex-1 items-center justify-center gap-4 py-8">
      <Image
        source={noLinksImage}
        className="h-52 w-[95%]"
        resizeMode="cover"
      />
      <View className="flex-1 items-center justify-center gap-2">
        <ThemedText
          text="Looks a bit lonely here."
          variant="body"
          weight="medium"
          color="default"
        />
        <ThemedText
          text="Add links - let's get this started"
          variant="caption"
          weight="medium"
          color="muted"
        />
      </View>
      <View className="w-1/4">
        <PrimaryButton onPress={openBottomSheet}>
          <ThemedText
            text="Add Link"
            variant="body"
            weight="normal"
            color="white"
            className="px-2"
          />
        </PrimaryButton>
      </View>
    </View>
  );
};

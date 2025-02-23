import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

export const LoadingStatus = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText
        text="Loading..."
        variant="body"
        weight="medium"
        color="default"
      />
    </View>
  );
};

export const NoLinksStatus = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText
        text="No links found"
        variant="body"
        weight="medium"
        color="default"
      />
      <ThemedText
        text="Please add some links to your collection"
        variant="caption"
        weight="medium"
        color="muted"
      />
    </View>
  );
};

export const SwipeScreenErrorStatus = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText
        text="Error loading data"
        variant="body"
        weight="medium"
        color="default"
      />
    </View>
  );
};

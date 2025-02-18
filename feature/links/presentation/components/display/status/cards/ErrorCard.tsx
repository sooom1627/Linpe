import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

type ErrorCardProps = {
  variant: "featured" | "horizontal";
};

export const ErrorCard = ({ variant }: ErrorCardProps) => {
  if (variant === "featured") {
    return (
      <View className="flex-1">
        <View className="flex-1 flex-col items-start justify-start gap-2">
          <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-gray-100 p-2">
            <ThemedText
              text="Something went wrong, Failed to load image"
              variant="body"
              weight="medium"
              color="muted"
            />
          </View>
          <ThemedText
            text="Something went wrong. Failed to load data"
            variant="body"
            weight="medium"
            color="muted"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-start gap-3">
      <View className="aspect-[1.91/1] h-20">
        <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-gray-100 p-2">
          <ThemedText
            text="Something went wrong, Failed to load image"
            variant="body"
            weight="medium"
            color="muted"
          />
        </View>
      </View>
      <View className="flex-1 flex-col items-start justify-start gap-2">
        <ThemedText
          text="Something went wrong. Failed to load data"
          variant="body"
          weight="medium"
          color="muted"
        />
      </View>
    </View>
  );
};

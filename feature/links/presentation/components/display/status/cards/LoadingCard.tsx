import { View } from "react-native";

type LoadingCardProps = {
  variant: "featured" | "horizontal";
};

export const LoadingCard = ({ variant }: LoadingCardProps) => {
  if (variant === "featured") {
    return (
      <View className="flex-1">
        <View className="flex-1">
          <View className="aspect-[1.91/1] w-full rounded-lg bg-gray-200" />
          <View className="mt-2 flex-1 flex-col items-start justify-start gap-1">
            <View className="h-4 w-3/4 rounded bg-gray-200" />
            <View className="h-3 w-1/2 rounded bg-gray-200" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-start gap-3">
      <View className="w-36">
        <View className="aspect-[1.91/1] w-full rounded-lg bg-gray-200" />
      </View>
      <View className="flex-1 flex-col items-start justify-start gap-2">
        <View className="h-4 w-3/4 rounded bg-gray-200" />
        <View className="h-4 w-1/2 rounded bg-gray-200" />
      </View>
    </View>
  );
};

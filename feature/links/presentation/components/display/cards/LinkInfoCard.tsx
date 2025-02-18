import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

interface LinkInfoCardProps {
  domain: string;
  title: string;
  description: string;
}

export function LinkInfoCard({
  domain,
  title,
  description,
}: LinkInfoCardProps) {
  const hasNoData = !title && !description;

  if (hasNoData) {
    return (
      <View className="h-44 w-full flex-col items-center justify-center gap-2 rounded-lg bg-red-50 px-6 py-6">
        <ThemedText
          text="No data available"
          variant="body"
          weight="semibold"
          color="muted"
        />
        <ThemedText
          text="Unable to fetch link information. Please try again later."
          variant="caption"
          weight="normal"
          color="muted"
          className="text-center"
        />
      </View>
    );
  }

  return (
    <View className="h-48 w-full flex-col items-start justify-start gap-3 rounded-lg bg-red-50 px-6 py-6">
      <ThemedText
        text={domain}
        variant="caption"
        weight="normal"
        color="muted"
        underline
      />
      <ThemedText
        text={title}
        variant="body"
        weight="semibold"
        color="default"
        numberOfLines={2}
      />
      <View className="flex-col items-start justify-start gap-1">
        <ThemedText
          text="Description"
          variant="caption"
          weight="semibold"
          color="accent"
        />
        <ThemedText
          text={description || "No description available"}
          variant="body"
          weight="semibold"
          color="muted"
          numberOfLines={3}
        />
      </View>
    </View>
  );
}

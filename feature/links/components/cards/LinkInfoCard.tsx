import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

interface LinkInfoCardProps {
  domain: string[];
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
      <View className="h-40 w-full flex-col items-center justify-center gap-2 rounded-lg bg-red-50 px-6 py-6">
        <ThemedText variant="body" weight="semibold" color="muted">
          {["No data available"]}
        </ThemedText>
        <ThemedText
          variant="caption"
          weight="normal"
          color="muted"
          className="text-center"
        >
          {["Unable to fetch link information. Please try again later."]}
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="h-40 w-full flex-col items-start justify-start gap-3 rounded-lg bg-red-50 px-6 py-6">
      <ThemedText variant="caption" weight="normal" color="muted" underline>
        {domain}
      </ThemedText>
      <ThemedText
        variant="body"
        weight="semibold"
        color="default"
        numberOfLines={2}
      >
        {title}
      </ThemedText>
      <View className="flex-col items-start justify-start gap-1">
        <ThemedText variant="body" weight="semibold" color="accent">
          {["description"]}
        </ThemedText>
        <ThemedText
          variant="body"
          weight="normal"
          color="default"
          numberOfLines={2}
        >
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

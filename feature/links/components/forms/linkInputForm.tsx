import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { z } from "zod";

import { ThemedText } from "@/components/text/ThemedText";

const urlSchema = z
  .string()
  .min(1, { message: "Please enter a URL" })
  .url({ message: "Invalid URL format" })
  .startsWith("https://", { message: "URL must start with https://" })
  .refine((url) => url.length <= 2048, {
    message: "URL is too long (max 2048 characters)",
  })
  .refine((url) => !url.includes(" "), {
    message: "URL cannot contain spaces",
  })
  .refine(
    (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL format" },
  );

interface Props {
  onUrlChange?: (url: string) => void;
}

export const LinkInputForm = ({ onUrlChange }: Props) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleUrlChange = (text: string) => {
    setUrl(text);
    if (text.length > 0) {
      const result = urlSchema.safeParse(text);
      if (!result.success) {
        setError(result.error.errors[0].message);
      } else {
        setError(null);
        onUrlChange?.(text);
      }
    } else {
      setError(null);
      onUrlChange?.("");
    }
  };

  const handlePaste = async () => {
    try {
      const content = await Clipboard.getStringAsync();
      handleUrlChange(content);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      Alert.alert(
        "Clipboard Access",
        "For privacy protection, clipboard access permission is required each time the app returns from background. This is an iOS security feature.",
        [{ text: "OK" }],
      );
    }
  };

  return (
    <View className="w-full">
      <View className="relative w-full">
        {!url ? (
          <TouchableOpacity
            onPress={handlePaste}
            className={`h-14 w-full flex-row items-center justify-center gap-2 rounded-lg border ${
              isFocused
                ? "border-blue-500 bg-blue-50"
                : "border-zinc-300 bg-white"
            }`}
            onPressIn={() => setIsFocused(true)}
            onPressOut={() => setIsFocused(false)}
          >
            <View className="rounded-md bg-zinc-100 px-2 py-1">
              <ThemedText variant="caption" weight="medium">
                {["⌘V"]}
              </ThemedText>
            </View>
            <ThemedText variant="body" weight="medium">
              {["Paste URL"]}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <View
            className={`h-14 w-full rounded-lg border px-3 ${
              isFocused
                ? "border-blue-500 bg-blue-50"
                : "border-zinc-300 bg-white"
            }`}
          >
            <View className="h-full flex-row items-center justify-between">
              <View className="mr-2 flex-1">
                <ThemedText variant="body" weight="medium" numberOfLines={1}>
                  {url}
                </ThemedText>
              </View>
              <TouchableOpacity
                className="p-2"
                onPress={() => handleUrlChange("")}
              >
                <ThemedText
                  variant="body"
                  weight="medium"
                  className="text-zinc-500"
                >
                  {["×"]}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {error && <Text className="mt-2 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

LinkInputForm.displayName = "LinkInputForm";

import { forwardRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

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
  onSubmit?: (url: string) => void;
  onUrlChange?: (url: string) => void;
}

export const LinkInputForm = forwardRef<TextInput, Props>(
  ({ onSubmit, onUrlChange }, ref) => {
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

    const handleSubmit = () => {
      const result = urlSchema.safeParse(url);
      if (result.success && onSubmit) {
        onSubmit(url);
      }
    };

    return (
      <View className="w-full">
        <View className="relative w-full">
          <TextInput
            ref={ref}
            className={`w-full rounded-lg border py-3 pl-3 pr-10 ${
              isFocused
                ? "border-blue-500 bg-blue-50"
                : "border-zinc-300 bg-white"
            }`}
            placeholder="https://example.com"
            value={url}
            onChangeText={handleUrlChange}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {url.length > 0 && (
            <TouchableOpacity
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
              onPress={() => handleUrlChange("")}
            >
              <Text className="text-lg text-zinc-500">×</Text>
            </TouchableOpacity>
          )}
        </View>
        {error && <Text className="mt-2 text-sm text-red-500">{error}</Text>}
      </View>
    );
  },
);

LinkInputForm.displayName = "LinkInputForm";

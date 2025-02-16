import { forwardRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  onSubmit?: (url: string) => void;
}

export const LinkInputForm = forwardRef<TextInput, Props>(
  ({ onSubmit }, ref) => {
    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const validateUrl = (input: string) => {
      const urlPattern = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
      return urlPattern.test(input);
    };

    const handleUrlChange = (text: string) => {
      setUrl(text);
      if (text.length > 0 && !validateUrl(text)) {
        setError("有効なHTTPSのURLを入力してください");
      } else {
        setError(null);
      }
    };

    const handleSubmit = () => {
      if (validateUrl(url) && onSubmit) {
        onSubmit(url);
      }
    };

    return (
      <View className="w-full">
        <TextInput
          ref={ref}
          className={`w-full rounded-lg border p-3 ${
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
        {error && <Text className="mt-2 text-sm text-red-500">{error}</Text>}
      </View>
    );
  },
);

LinkInputForm.displayName = "LinkInputForm";

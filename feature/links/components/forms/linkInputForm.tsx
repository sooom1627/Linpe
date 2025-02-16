import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  onSubmit?: (url: string) => void;
}

export const LinkInputForm = ({ onSubmit }: Props) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

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
        className="w-full rounded-lg border border-gray-300 p-3"
        placeholder="https://example.com"
        value={url}
        onChangeText={handleUrlChange}
        onSubmitEditing={handleSubmit}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      {error && <Text className="mt-2 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

import { View } from "react-native";
import { AlertTriangle } from "lucide-react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";

interface ErrorStatusProps {
  error?: Error | null;
  onRetry?: () => void;
}

export const ErrorStatus = ({ error, onRetry }: ErrorStatusProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <AlertTriangle size={48} color="#EF4444" />
      <ThemedText
        text="エラーが発生しました"
        variant="h3"
        weight="bold"
        color="error"
      />
      {error && (
        <ThemedText
          text={error.message}
          variant="body"
          weight="medium"
          color="muted"
        />
      )}
      {onRetry && (
        <PrimaryButton onPress={onRetry}>
          <ThemedText
            text="再試行"
            variant="body"
            weight="medium"
            color="white"
          />
        </PrimaryButton>
      )}
    </View>
  );
};

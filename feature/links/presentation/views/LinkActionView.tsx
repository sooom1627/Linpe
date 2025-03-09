import { memo, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import { useSWRConfig } from "swr";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useLinkAction } from "@/feature/links/application/hooks/link";
import { LoadingCard } from "@/feature/links/presentation/components/display/status/cards/LoadingCard";
import {
  MarkActions,
  type MarkType,
} from "@/feature/links/presentation/components/input/actions";
import { HorizontalCard } from "../components/display";

export const LinkActionView = memo(function LinkActionView({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selectedMark, setSelectedMark] = useState<MarkType | null>(null);
  const { deleteLinkAction, isLoading } = useLinkAction();
  const params = useLocalSearchParams<{
    userId: string;
    linkId: string;
    imageUrl: string;
    title: string;
    domain: string;
    full_url: string;
  }>();
  const { mutate } = useSWRConfig();

  const handleMarkAsRead = () => {
    if (selectedMark) {
      console.log("Selected mark type:", selectedMark);
      onClose();
    }
  };
  const { userId, linkId, imageUrl, title, domain, full_url } = params;

  const handleDelete = async () => {
    console.log("handleDelete called with params:", { userId, linkId });

    if (!userId || !linkId) {
      console.error("No linkId or userId in params");
      onClose();
      return;
    }

    try {
      const result = await deleteLinkAction(userId, linkId);
      if (result.success) {
        console.log("Link action deleted successfully");

        // SWRのキャッシュをクリア
        // useTopViewLinksのキャッシュをクリア
        mutate(["today-links", userId]);

        // その他の関連するキャッシュもクリア
        mutate(["swipeable-links", userId]);
        mutate([`user-links-${userId}`, 10]); // デフォルトのlimit値を使用

        // 汎用的なキャッシュもクリア
        mutate((key) => Array.isArray(key) && key[0].includes("links"));

        // 成功時のToastを表示
        Toast.show({
          text1: "リンクが削除されました",
          type: "success",
          position: "top",
          topOffset: 70,
          visibilityTime: 3000,
        });
      } else {
        console.error("Failed to delete link action:", result.error);

        // エラー時のToastを表示
        Toast.show({
          text1: "リンクの削除に失敗しました",
          text2: result.error?.message || "不明なエラーが発生しました",
          type: "error",
          position: "top",
          topOffset: 70,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting link action:", error);

      // 例外発生時のToastを表示
      Toast.show({
        text1: "リンクの削除に失敗しました",
        text2:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        type: "error",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    } finally {
      onClose();
    }
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-row items-center justify-start gap-1">
        <Check size={16} color="#FA4714" />
        <Title title="Mark the link as" />
      </View>
      {imageUrl && title && domain && (
        <HorizontalCard
          imageUrl={imageUrl}
          title={title}
          domain={domain}
          full_url={full_url || ""}
        />
      )}
      {!imageUrl && !title && !domain && <LoadingCard variant="horizontal" />}
      <MarkActions selectedMark={selectedMark} onSelect={setSelectedMark} />
      <View className="flex-row gap-2">
        <View className="flex-1">
          <AlertButton onPress={handleDelete}>
            <ThemedText
              text="Delete Link"
              variant="body"
              weight="medium"
              color="white"
            />
          </AlertButton>
        </View>
        <View className="flex-1">
          <PrimaryButton onPress={handleMarkAsRead} loading={isLoading}>
            <ThemedText
              text={`Mark as ${selectedMark ?? ""}`}
              variant="body"
              weight="medium"
              color="white"
            />
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
});

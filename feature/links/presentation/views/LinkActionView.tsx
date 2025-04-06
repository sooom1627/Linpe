import { memo, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useLinkAction } from "@/feature/links/application/hooks/link";
import { useOGData } from "@/feature/links/application/hooks/og/useOGData";
import { getOptimalImageUrl } from "@/feature/links/infrastructure/utils";
import { LoadingCard } from "@/feature/links/presentation/components/display/status/cards/LoadingCard";
import {
  MarkActions,
  type MarkType,
} from "@/feature/links/presentation/components/input/actions";
import { HorizontalCard } from "../components/display";

/**
 * 安全なデコード関数
 * パラメータを安全にデコードする
 */
const safeDecodeURIComponent = (value: string | undefined | null): string => {
  if (!value) return "";

  try {
    // 標準的なデコード処理を試みる
    return decodeURIComponent(value);
  } catch {
    // デコードに失敗した場合は元の値を返す
    return value;
  }
};

export const LinkActionView = memo(function LinkActionView({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selectedMark, setSelectedMark] = useState<MarkType | null>(null);
  const { deleteLinkAction, updateLinkActionByReadStatus, isLoading } =
    useLinkAction();
  const params = useLocalSearchParams<{
    userId: string;
    linkId: string;
    imageUrl: string;
    title: string;
    domain: string;
    full_url: string;
    swipeCount: string;
  }>();

  // パラメータを安全にデコード
  const userId = params.userId;
  const linkId = params.linkId;
  const rawImageUrl = safeDecodeURIComponent(params.imageUrl);
  const title = safeDecodeURIComponent(params.title);
  const domain = safeDecodeURIComponent(params.domain);
  const full_url = safeDecodeURIComponent(params.full_url);
  const swipeCount = params.swipeCount;

  // フルURLからOGデータを取得（画像を含む）
  const { ogData } = useOGData(full_url);

  // ユーティリティ関数を使用して最適な画像URLを取得
  const imageUrl = getOptimalImageUrl(ogData, rawImageUrl);

  const handleMarkAsRead = async () => {
    if (!selectedMark) return;

    if (!userId || !linkId) {
      console.error("No linkId or userId in params");
      onClose();
      return;
    }

    try {
      // SelectedMarkをそのままStatusとして使用
      const status = selectedMark as "Read" | "Skip" | "Re-Read" | "Bookmark";

      // swipeCountを数値に変換（存在しない場合は0を使用）
      const swipeCountNum = swipeCount ? parseInt(swipeCount, 10) : 0;

      // 新しいメソッドを使用
      await updateLinkActionByReadStatus(userId, linkId, status, swipeCountNum);
      onClose();
    } catch (error) {
      console.error("Error in handleMarkAsRead:", error);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!userId || !linkId) {
      console.error("No linkId or userId in params");
      onClose();
      return;
    }

    try {
      await deleteLinkAction(userId, linkId);
    } catch (error) {
      console.error("Error in handleDelete:", error);
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
      {title && domain && (
        <HorizontalCard
          imageUrl={imageUrl}
          title={title}
          domain={domain}
          full_url={full_url || ""}
        />
      )}
      {(!title || !domain) && <LoadingCard variant="horizontal" />}
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

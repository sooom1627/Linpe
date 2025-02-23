import { useCallback, useEffect, useRef } from "react";
import { View, type TextInput } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

import { LinkIcon } from "@/components/icons/LinkIcon";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { useLinkInputModal } from "@/feature/links/application/context/LinkInputModalContext";
import { useLinkInput } from "@/feature/links/application/hooks";
import { LinkPreview } from "@/feature/links/presentation/components/display";
import {
  LinkInputActions,
  LinkInputForm,
} from "@/feature/links/presentation/components/input";

export const LinkInputView = () => {
  const { bottomSheetRef, closeModal } = useLinkInputModal();
  const { session } = useSessionContext();
  const inputRef = useRef<TextInput>(null);
  const {
    url,
    setUrl,
    isSubmitting,
    ogData,
    isLoading,
    isError,
    handleAddLink,
  } = useLinkInput(session?.user?.id);

  // スナップポイントの設定（50%〜90%）
  const snapPoints = ["50%", "90%"];

  // バックドロップのレンダリング
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  // モーダルの状態変更ハンドラ
  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        closeModal();
      }
    },
    [closeModal],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      handleComponent={() => (
        <View className="h-1 w-12 self-center rounded-full bg-gray-200" />
      )}
    >
      <BottomSheetView className="flex-1 px-4 py-6">
        <View className="flex-1 gap-4">
          <View className="flex-row items-center justify-start gap-2">
            <LinkIcon size={16} color="#FA4714" />
            <Title title="Add a Link" />
          </View>
          <LinkInputForm onUrlChange={setUrl} />
          <LinkPreview
            full_url={url}
            ogData={ogData ?? null}
            isLoading={isLoading}
            isError={isError}
          />
          <LinkInputActions
            onCancel={closeModal}
            onAdd={handleAddLink}
            isLoading={isLoading}
            isError={isError}
            isSubmitting={isSubmitting}
            hasUrl={!!url}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

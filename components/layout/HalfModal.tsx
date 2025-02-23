import { useCallback } from "react";
import { View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

type HalfModalProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
  children: React.ReactNode;
};

export const HalfModal = ({
  bottomSheetRef,
  onClose,
  children,
}: HalfModalProps) => {
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
        onClose();
      }
    },
    [onClose],
  );

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
        <View className="flex-1">{children}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

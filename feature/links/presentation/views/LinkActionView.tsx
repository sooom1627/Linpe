import { memo, useState } from "react";
import { Pressable, View } from "react-native";
import {
  BookCheck,
  BookHeart,
  BookMarked,
  BookOpenText,
  Check,
} from "lucide-react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { type HalfModalProps } from "@/components/layout/half-modal/types/modal";
import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { LoadingCard } from "@/feature/links/presentation/components/display";

type MarkType = "Reading" | "Read" | "Re-Read" | "Bookmark";

const MARK_ACTIONS: { type: MarkType; icon: typeof BookOpenText }[] = [
  { type: "Reading", icon: BookOpenText },
  { type: "Read", icon: BookCheck },
  { type: "Re-Read", icon: BookHeart },
  { type: "Bookmark", icon: BookMarked },
];

export const LinkActionView = memo(function LinkActionView({
  onClose,
}: HalfModalProps) {
  const [selectedMark, setSelectedMark] = useState<MarkType | null>(null);

  const handleMarkAsRead = () => {
    if (selectedMark) {
      console.log("Selected mark type:", selectedMark);
      onClose();
    }
  };

  const handleDelete = () => {
    onClose();
  };

  const ActionButton = ({
    type,
    icon: Icon,
  }: {
    type: MarkType;
    icon: typeof BookOpenText;
  }) => (
    <Pressable
      onPress={() => setSelectedMark(type)}
      className="flex-1 flex-col items-center gap-1"
    >
      <View
        className={`flex-1 rounded-lg p-6 ${
          selectedMark === type
            ? "bg-zinc-700 dark:bg-zinc-100"
            : "bg-zinc-100 dark:bg-zinc-800"
        }`}
      >
        <Icon
          strokeWidth={1.5}
          size={16}
          color={selectedMark === type ? "white" : "black"}
        />
      </View>
      <ThemedText
        text={type}
        variant="caption"
        weight={selectedMark === type ? "semibold" : "medium"}
        color="default"
      />
    </Pressable>
  );

  return (
    <View className="flex-col gap-4">
      <View className="flex-row items-center justify-start gap-1">
        <Check size={16} color="#FA4714" />
        <Title title="Mark the link as" />
      </View>
      <LoadingCard variant="horizontal" />
      <View className="w-full flex-row justify-between gap-4">
        {MARK_ACTIONS.map((action) => (
          <ActionButton key={action.type} {...action} />
        ))}
      </View>
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
          <PrimaryButton onPress={handleMarkAsRead} loading={false}>
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

import { useEffect, useRef, useState } from "react";
import { View, type TextInput } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { HalfModal } from "@/components/layout/HalfModal";
import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { useOGData } from "../../hooks/useOGData";
import { HorizontalCard } from "../cards/HorizontalCard";
import { LoadingCard } from "../cards/LoadingCard";
import { LinkInputForm } from "../forms/linkInputForm";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();
  const inputRef = useRef<TextInput>(null);
  const [url, setUrl] = useState<string>("");
  const { ogData, isLoading, isError } = useOGData(url);

  useEffect(() => {
    setUrl("");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const renderContent = () => {
    if (!url) {
      return (
        <View className="h-20 items-center justify-center rounded-lg border border-gray-200">
          <ThemedText className="text-gray-400">
            {["Please enter a URL"]}
          </ThemedText>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View className="h-20">
          <LoadingCard variant="horizontal" />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="h-20 items-center justify-center rounded-lg border border-red-200 bg-red-50">
          <ThemedText className="text-red-400">
            {["Failed to load data"]}
          </ThemedText>
        </View>
      );
    }

    return (
      <View className="h-20">
        <HorizontalCard full_url={url} ogData={ogData ?? null} />
      </View>
    );
  };

  return (
    <HalfModal isOpen={isOpen} onClose={closeModal}>
      <View className="flex-1 gap-4">
        <View className="flex-row items-center justify-start gap-2">
          <LinkIcon size={16} color="#FA4714" />
          <Title title="Add a Link" />
        </View>
        <LinkInputForm onUrlChange={setUrl} />
        {renderContent()}
        <View className="flex-row gap-2">
          <View className="flex-1">
            <AlertButton onPress={closeModal} testID="cancel-button">
              <ThemedText className="text-white" weight="medium">
                {["Cancel"]}
              </ThemedText>
            </AlertButton>
          </View>
          <View className="flex-1">
            <PrimaryButton
              onPress={() => {}}
              testID="add-link-button"
              loading={isLoading || !url || isError}
            >
              <ThemedText className="text-white" weight="medium">
                {["Add Link"]}
              </ThemedText>
            </PrimaryButton>
          </View>
        </View>
      </View>
    </HalfModal>
  );
};

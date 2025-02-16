import { useEffect, useRef, useState } from "react";
import { View, type TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { mutate } from "swr";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { HalfModal } from "@/components/layout/HalfModal";
import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { addLinkAndUser } from "@/feature/links/service/linkServices";
import { HorizontalCard } from "../components/cards/HorizontalCard";
import { LoadingCard } from "../components/cards/LoadingCard";
import { LinkInputForm } from "../components/forms/linkInputForm";
import { useOGData } from "../hooks/useOGData";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();
  const { session } = useSessionContext();
  const inputRef = useRef<TextInput>(null);
  const [url, setUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleAddLink = async (): Promise<void> => {
    if (!session?.user?.id || !url) return;

    try {
      setIsSubmitting(true);
      const data = await addLinkAndUser(url, session.user.id);
      await mutate(
        (key) => typeof key === "string" && key.startsWith("links-"),
      );
      Toast.show({
        text1: data,
        type: "success",
      });
      setUrl("");
    } catch (error) {
      console.error("リンクの追加に失敗しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onPress={handleAddLink}
              testID="add-link-button"
              loading={isLoading || !url || isError || isSubmitting}
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

import { useState } from "react";
import Toast from "react-native-toast-message";
import { mutate } from "swr";

import { useOGData } from "@/feature/links/application/hooks/og/useOGData";
import { linkService } from "@/feature/links/application/service/linkServices";

export const useLinkInput = (userId: string | undefined) => {
  const [url, setUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ogData, isLoading, isError } = useOGData(url);

  const handleAddLink = async (): Promise<void> => {
    if (!userId || !url) return;

    try {
      setIsSubmitting(true);
      const data = await linkService.addLinkAndUser(url, userId);
      await mutate(
        (key) =>
          (typeof key === "string" && key.startsWith("links-")) ||
          (Array.isArray(key) &&
            typeof key[0] === "string" &&
            key[0].startsWith("links-")),
      );
      setUrl("");
      Toast.show({
        text1: data.status === "registered" ? "Success" : "Already registered",
        type: data.status === "registered" ? "success" : "info",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    } catch (error: Error | unknown) {
      Toast.show({
        text1: error instanceof Error ? error.message : "Failed to add link",
        type: "error",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    url,
    setUrl,
    isSubmitting,
    ogData,
    isLoading,
    isError,
    handleAddLink,
  };
};

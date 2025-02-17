import { useState } from "react";
import Toast from "react-native-toast-message";
import { addLinkAndUser } from "feature/links/application/services";
import { mutate } from "swr";

export const useLinkInput = (userId: string | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLink = async (url: string): Promise<boolean> => {
    if (!userId || !url) return false;

    try {
      setIsSubmitting(true);
      const data = await addLinkAndUser(url, userId);
      await mutate(
        (key) =>
          (typeof key === "string" && key.startsWith("links-")) ||
          (Array.isArray(key) &&
            typeof key[0] === "string" &&
            key[0].startsWith("links-")),
      );

      Toast.show({
        text1:
          data === "registered"
            ? "Success, Link added"
            : "This link is already registered",
        type: data === "registered" ? "success" : "info",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      return data !== "";
    } catch (error: Error | unknown) {
      Toast.show({
        text1: error instanceof Error ? error.message : "Failed to add link",
        type: "error",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleAddLink,
  };
};

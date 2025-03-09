import { useState } from "react";
import { mutate } from "swr";

import { useOGData } from "@/feature/links/application/hooks/og/useOGData";
import { linkService } from "@/feature/links/application/service/linkServices";
import { notificationService } from "@/lib/notification";

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

      if (data.status === "registered") {
        notificationService.success("Success", undefined, {
          position: "top",
          offset: 70,
          duration: 3000,
        });
      } else {
        notificationService.info("Already registered", undefined, {
          position: "top",
          offset: 70,
          duration: 3000,
        });
      }
    } catch (error: Error | unknown) {
      notificationService.error(
        error instanceof Error ? error.message : "Failed to add link",
        undefined,
        { position: "top", offset: 70, duration: 3000 },
      );
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

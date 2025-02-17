import { useCallback } from "react";
import { WebBrowserPresentationStyle } from "expo-web-browser";

import { useWebBrowser } from "@/feature/links/application/hooks/browser";

type OpenBrowserProps = {
  url: string;
  domain?: string;
};

export const useOpenBrowser = () => {
  const { openBrowser, addAllowedDomain } = useWebBrowser();

  const handleOpenBrowser = useCallback(
    async ({ url, domain }: OpenBrowserProps) => {
      try {
        if (domain) {
          addAllowedDomain({ domain });
        }
        await openBrowser(url, {
          presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
        });
      } catch (error) {
        console.error("Failed to open browser:", error);
      }
    },
    [addAllowedDomain, openBrowser],
  );

  return handleOpenBrowser;
};

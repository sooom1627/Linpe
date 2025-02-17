import { useCallback, useState } from "react";

import type {
  AllowedDomain,
  WebBrowserOptions,
  WebBrowserResult,
} from "../domain/models/types";
import { WebBrowserService } from "../service/WebBrowserService";

export const useWebBrowser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const webBrowserService = WebBrowserService.getInstance();

  const openBrowser = useCallback(
    async (
      url: string,
      options?: WebBrowserOptions,
    ): Promise<WebBrowserResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await webBrowserService.openBrowser(url, options);
        if (result.type === "error" && result.error) {
          setError(result.error);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [webBrowserService],
  );

  const closeBrowser = useCallback(async () => {
    try {
      await webBrowserService.closeBrowser();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to close browser");
      setError(err);
      throw err;
    }
  }, [webBrowserService]);

  const addAllowedDomain = useCallback(
    (domain: AllowedDomain) => {
      webBrowserService.addAllowedDomain(domain);
    },
    [webBrowserService],
  );

  const removeAllowedDomain = useCallback(
    (domain: string) => {
      webBrowserService.removeAllowedDomain(domain);
    },
    [webBrowserService],
  );

  return {
    openBrowser,
    closeBrowser,
    addAllowedDomain,
    removeAllowedDomain,
    isLoading,
    error,
  };
};

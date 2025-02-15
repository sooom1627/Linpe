import * as WebBrowser from "expo-web-browser";

import {
  type AllowedDomain,
  type IWebBrowserService,
  type WebBrowserOptions,
  type WebBrowserResult,
} from "@/feature/links/types/webBrowser";

export class WebBrowserService implements IWebBrowserService {
  private static instance: WebBrowserService;
  private allowedDomains: Set<AllowedDomain> = new Set();
  private isLoading: boolean = false;

  private constructor() {
    // プライベートコンストラクタでインスタンス化を制限
  }

  public static getInstance(): WebBrowserService {
    if (!WebBrowserService.instance) {
      WebBrowserService.instance = new WebBrowserService();
    }
    return WebBrowserService.instance;
  }

  public async openBrowser(
    url: string,
    options?: WebBrowserOptions,
  ): Promise<WebBrowserResult> {
    try {
      if (!this.isValidUrl(url)) {
        throw new Error("Invalid URL or domain not allowed");
      }

      this.isLoading = true;
      const result = await WebBrowser.openBrowserAsync(url, {
        presentationStyle: options?.presentationStyle,
        controlsColor: options?.controlsColor,
        toolbarColor: options?.toolbarColor,
      });

      return {
        type: result.type === "cancel" ? "dismiss" : "success",
      };
    } catch (error) {
      return {
        type: "error",
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    } finally {
      this.isLoading = false;
    }
  }

  public async closeBrowser(): Promise<void> {
    try {
      await WebBrowser.dismissBrowser();
    } catch (error) {
      console.error("Error closing browser:", error);
      throw error;
    }
  }

  public isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      for (const allowedDomain of this.allowedDomains) {
        if (domain.endsWith(allowedDomain.domain)) {
          if (allowedDomain.requireHttps && urlObj.protocol !== "https:") {
            return false;
          }
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  public addAllowedDomain(domain: AllowedDomain): void {
    this.allowedDomains.add(domain);
  }

  public removeAllowedDomain(domain: string): void {
    for (const allowedDomain of this.allowedDomains) {
      if (domain === allowedDomain.domain) {
        this.allowedDomains.delete(allowedDomain);
        break;
      }
    }
  }

  public get loading(): boolean {
    return this.isLoading;
  }
}

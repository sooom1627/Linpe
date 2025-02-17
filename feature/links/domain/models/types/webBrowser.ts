import { type WebBrowserPresentationStyle } from "expo-web-browser";

export type WebBrowserResult = {
  type: "success" | "error" | "dismiss";
  error?: Error;
};

export type WebBrowserOptions = {
  presentationStyle?: WebBrowserPresentationStyle;
  controlsColor?: string;
  toolbarColor?: string;
};

export type AllowedDomain = {
  domain: string;
  requireHttps?: boolean;
};

export interface IWebBrowserService {
  openBrowser(
    url: string,
    options?: WebBrowserOptions,
  ): Promise<WebBrowserResult>;
  closeBrowser(): Promise<void>;
  isValidUrl(url: string): boolean;
  addAllowedDomain(domain: AllowedDomain): void;
  removeAllowedDomain(domain: string): void;
}

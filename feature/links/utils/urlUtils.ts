export const parseUrl = (
  url: string,
): { domain: string; parameter: string | null; cleanUrl: string } => {
  if (!url?.trim()) {
    throw new Error("URL_EMPTY");
  }

  try {
    const urlObj = new URL(url);
    if (!["https:"].includes(urlObj.protocol)) {
      throw new Error("URL_INVALID_PROTOCOL");
    }
    const domain = urlObj.hostname;

    // search と hash を連結して parameter とする
    const parameter =
      urlObj.search || urlObj.hash ? `${urlObj.search}${urlObj.hash}` : null;

    // パラメーターとハッシュを除いたURLを生成
    urlObj.search = "";
    urlObj.hash = "";
    const cleanUrl = urlObj.toString();

    return {
      domain,
      parameter,
      cleanUrl,
    };
  } catch (_error) {
    console.error(_error);
    if (_error instanceof Error && _error.message === "URL_EMPTY") {
      throw new Error("URL is required");
    }
    if (_error instanceof Error && _error.message === "URL_INVALID_PROTOCOL") {
      throw new Error("URL must use https protocol");
    }
    throw new Error("Invalid URL format");
  }
};

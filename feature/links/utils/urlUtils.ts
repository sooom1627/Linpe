export const parseUrl = (
  url: string,
): { domain: string; parameter: string | null; cleanUrl: string } => {
  try {
    const urlObj = new URL(url);
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
    throw new Error("無効なURLです");
  }
};

import { getLinkPreview } from "link-preview-js";

export const fetchOGDataFromApi = async (
  url: string,
  options: { headers?: Record<string, string>; timeout?: number },
) => {
  return await getLinkPreview(url, options);
};

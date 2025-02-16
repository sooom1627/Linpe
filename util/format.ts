/**
 * 日付をYYYY/MM/DD形式にフォーマットする
 * @param date フォーマットする日付
 * @returns YYYY/MM/DD形式の文字列
 */
export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

import { type UserLink } from "./links";

export type LinkTabGroup = "toRead" | "read";

export interface LinkTabConfig {
  id: LinkTabGroup;
  label: string;
  statuses: string[];
  filter: (links: UserLink[]) => UserLink[];
}

export const LINK_TABS_CONFIG: Record<LinkTabGroup, LinkTabConfig> = {
  toRead: {
    id: "toRead",
    label: "To Read",
    statuses: ["add", "Skip", "Today", "inWeekend", "Re-Read"],
    filter: (links) =>
      links.filter((link) => {
        // まだ読んでいないリンク
        if (link.read_at === null) return true;

        // re_readフラグがtrueであり、有効なステータスを持つリンク
        const validReReadStatuses = ["Skip", "Today", "inMonth", "Read"];
        if (validReReadStatuses.includes(link.status) && link.re_read === true)
          return true;

        return false;
      }),
  },
  read: {
    id: "read",
    label: "Read",
    statuses: ["Read", "Re-Read", "Bookmark"],
    filter: (links) => {
      // Readタブには読了済みのリンクを全て表示する
      // また、Re-Readフラグが立っているリンクも表示する（ステータスによらず）
      return links.filter((link) => {
        if (link.read_at !== null) return true;

        // re_readフラグがtrueのリンク
        const validReReadStatuses = ["Skip", "Today", "inMonth", "Read"];
        if (validReReadStatuses.includes(link.status) && link.re_read === true)
          return true;

        return false;
      });
    },
  },
};

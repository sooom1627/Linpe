import { type UserLink } from "./links";

export type LinkTabGroup = "all" | "toRead" | "read";

export interface LinkTabConfig {
  id: LinkTabGroup;
  label: string;
  statuses: string[];
  filter: (links: UserLink[]) => UserLink[];
}

export const LINK_TABS_CONFIG: Record<LinkTabGroup, LinkTabConfig> = {
  all: {
    id: "all",
    label: "All",
    statuses: [
      "add",
      "Today",
      "inWeekend",
      "Reading",
      "Read",
      "Re-Read",
      "Bookmark",
      "Skip",
    ],
    filter: (links) => links,
  },
  toRead: {
    id: "toRead",
    label: "To Read",
    statuses: ["add", "Skip", "Today", "inWeekend", "Reading", "Re-Read"],
    filter: (links) =>
      links.filter(
        (link) => link.read_at === null || link.status === "Re-Read",
      ),
  },
  read: {
    id: "read",
    label: "Read",
    statuses: ["Read", "Re-Read", "Bookmark"],
    filter: (links) => links.filter((link) => link.read_at !== null),
  },
};

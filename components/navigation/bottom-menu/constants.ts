import { DashboardIcon } from "../../icons/DashboardIcon";
import { HomeIcon } from "../../icons/HomeIcon";
import { SwipeIcon } from "../../icons/SwipeIcon";

export type IconComponent = React.ComponentType<{
  active: boolean;
  size?: number;
}>;

export type MenuPath =
  | "/(protected)"
  | "/(protected)/swipe"
  | "/(protected)/dashboard";

export interface MenuItem {
  path: MenuPath;
  Icon: IconComponent;
  matchPaths?: string[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    path: "/(protected)",
    Icon: HomeIcon,
    matchPaths: ["/", "/index"],
  },
  {
    path: "/(protected)/swipe",
    Icon: SwipeIcon,
    matchPaths: ["/swipe"],
  },
  {
    path: "/(protected)/dashboard",
    Icon: DashboardIcon,
    matchPaths: ["/dashboard"],
  },
];

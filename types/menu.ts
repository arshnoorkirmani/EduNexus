// types/menu.ts
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
}

export type MenuConfig = Record<string, MenuSection[]>;

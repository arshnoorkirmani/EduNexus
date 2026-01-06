// types/navigation.ts
import type { ElementType } from "react";

export type Role = "institute" | "teacher" | "student" | "user";

export type MenuItem = {
  id: string;
  title: string;
  url: string;
  icon: ElementType;
};

export type Section = {
  label: string;
  navs_item: MenuItem[];
};

export type RoleMenu = {
  role: Role;
  sections: Section[];
};

export type RoleMenuMap = Record<Role, Section[]>;

import { NotificationsEffects } from '@dspace/core';
import { RelationshipEffects } from '@dspace/core';
import { NavbarEffects } from './navbar/navbar.effects';
import { SidebarEffects } from './shared/sidebar/sidebar-effects.service';
import { ThemeEffects } from './shared/theme-support/theme.effects';
import { StoreEffects } from "./store.effects";

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  NotificationsEffects,
  SidebarEffects,
  ThemeEffects,
  RelationshipEffects,
];

import { NotificationsEffects } from './core/notifications/notifications.effects';
import { RelationshipEffects } from './core/states/name-variant/relationship.effects';
import { StoreEffects } from './core/store.effects';
import { NavbarEffects } from './navbar/navbar.effects';
import { SidebarEffects } from './shared/sidebar/sidebar-effects.service';
import { ThemeEffects } from './shared/theme-support/theme.effects';

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  NotificationsEffects,
  SidebarEffects,
  ThemeEffects,
  RelationshipEffects,
];

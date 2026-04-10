import { NavbarEffects } from './navbar/navbar.effects';
import { RelationshipEffects } from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/relationship.effects';
import { NotificationsEffects } from './shared/notifications/notifications.effects';
import { SidebarEffects } from './shared/sidebar/sidebar-effects.service';
import { ThemeEffects } from './shared/theme-support/theme.effects';
import { StoreEffects } from './store.effects';

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  NotificationsEffects,
  SidebarEffects,
  ThemeEffects,
  RelationshipEffects,
];

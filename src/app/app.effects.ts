import { StoreEffects } from './store.effects';
import { NotificationsEffects } from './shared/notifications/notifications.effects';
import { NavbarEffects } from './navbar/navbar.effects';
import { RelationshipEffects } from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/relationship.effects';
import { SidebarEffects } from './shared/sidebar/sidebar-effects.service';

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  NotificationsEffects,
  SidebarEffects,
  RelationshipEffects
];

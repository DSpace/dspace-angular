import { StoreEffects } from './store.effects';
import { NotificationsEffects } from './shared/notifications/notifications.effects';
import { NavbarEffects } from './navbar/navbar.effects';
import { MenuEffects } from './shared/menu/menu.effects';

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  NotificationsEffects,
  MenuEffects
];

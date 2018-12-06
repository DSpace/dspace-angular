import { HeaderEffects } from './header/header.effects';
import { NotificationsEffects } from './shared/notifications/notifications.effects';
import { StoreEffects } from './store.effects';

export const appEffects = [
  StoreEffects,
  HeaderEffects,
  NotificationsEffects
];

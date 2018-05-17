
import { HeaderEffects } from './header/header.effects';
import { StoreEffects } from './store.effects';
import { NotificationsEffects } from './shared/notifications/notifications.effects';

export const appEffects = [
  StoreEffects,
  HeaderEffects,
  NotificationsEffects
];

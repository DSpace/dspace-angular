import { StoreEffects } from './store.effects';
import { NotificationsEffects } from './shared/notifications/notifications.effects';
import { NavbarEffects } from './navbar/navbar.effects';
import { SearchSidebarEffects } from './shared/search/search-sidebar/search-sidebar.effects';
import { RelationshipEffects } from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/relationship.effects';

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  NotificationsEffects,
  SearchSidebarEffects,
  RelationshipEffects
];


import { NavbarEffects } from './navbar/navbar.effects';
import { RelationshipEffects } from './shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/relationship.effects';
import { MenuEffects } from './shared/menu/menu.effects';
import { SidebarEffects } from './shared/sidebar/sidebar-effects.service';
import { ThemeEffects } from './shared/theme-support/theme.effects';
import { StoreEffects } from './store.effects';

export const appEffects = [
  StoreEffects,
  NavbarEffects,
  SidebarEffects,
  ThemeEffects,
  RelationshipEffects,
  MenuEffects,
];

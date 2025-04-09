import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../../theme-support/themed.component';
import { UserMenuComponent } from './user-menu.component';

/**
 * This component represents the user nav menu.
 */
@Component({
  selector: 'ds-user-menu',
  templateUrl: './../../theme-support/themed.component.html',
  styleUrls: [],
  standalone: true,
  imports: [UserMenuComponent],
})
export class ThemedUserMenuComponent extends ThemedComponent<UserMenuComponent>{

  /**
   * The input flag to show user details in navbar expandable menu
   */
  @Input() inExpandableNavbar: boolean;

  protected inAndOutputNames: (keyof UserMenuComponent & keyof this)[] = ['inExpandableNavbar'];

  protected getComponentName(): string {
    return 'UserMenuComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import((`../../../../themes/${themeName}/app/shared/auth-nav-menu/user-menu/user-menu.component`));
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./user-menu.component');
  }
}

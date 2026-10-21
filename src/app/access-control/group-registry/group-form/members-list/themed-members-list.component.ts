import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { MembersListComponent } from './members-list.component';

/**
 * Themed wrapper for MembersListComponent
 */
@Component({
  selector: 'ds-members-list',
  templateUrl: '../../../../shared/theme-support/themed.component.html',
})
export class ThemedMembersListComponent extends ThemedComponent<MembersListComponent> {

  @Input() messagePrefix: string;

  protected inAndOutputNames: (keyof MembersListComponent & keyof this)[] = ['messagePrefix'];

  protected getComponentName(): string {
    return 'MembersListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/access-control/group-registry/group-form/members-list/members-list.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./members-list.component');
  }
}

import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { SubgroupsListComponent } from './subgroups-list.component';

/**
 * Themed wrapper for SubgroupsListComponent
 */
@Component({
  selector: 'ds-subgroups-list',
  templateUrl: '../../../../shared/theme-support/themed.component.html',
})
export class ThemedSubgroupsListComponent extends ThemedComponent<SubgroupsListComponent> {

  @Input() messagePrefix: string;

  protected inAndOutputNames: (keyof SubgroupsListComponent & keyof this)[] = ['messagePrefix'];

  protected getComponentName(): string {
    return 'SubgroupsListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/access-control/group-registry/group-form/subgroup-list/subgroups-list.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./subgroups-list.component');
  }
}

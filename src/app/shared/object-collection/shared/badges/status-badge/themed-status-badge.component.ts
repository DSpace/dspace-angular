import {
  Component,
  Input,
} from '@angular/core';

import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { ThemedComponent } from '../../../../theme-support/themed.component';
import { StatusBadgeComponent } from './status-badge.component';

/**
 * Themed wrapper for StatusBadgeComponent
 */
@Component({
  selector: 'ds-status-badge',
  styleUrls: [],
  templateUrl: '../../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    StatusBadgeComponent,
  ],
})
export class ThemedStatusBadgeComponent extends ThemedComponent<StatusBadgeComponent> {
  @Input() object: DSpaceObject;

  protected inAndOutputNames: (keyof StatusBadgeComponent & keyof this)[] = ['object'];

  protected getComponentName(): string {
    return 'StatusBadgeComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/object-collection/shared/badges/status-badge/status-badge.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./status-badge.component`);
  }
}

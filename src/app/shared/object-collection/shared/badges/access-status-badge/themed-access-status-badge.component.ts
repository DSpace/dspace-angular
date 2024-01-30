import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../../theme-support/themed.component';
import { AccessStatusBadgeComponent } from './access-status-badge.component';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';

/**
 * Themed wrapper for AccessStatusBadgeComponent
 */
@Component({
  selector: 'ds-themed-access-status-badge',
  styleUrls: [],
  templateUrl: '../../../../theme-support/themed.component.html',
})
export class ThemedAccessStatusBadgeComponent extends ThemedComponent<AccessStatusBadgeComponent> {
  @Input() object: DSpaceObject;

  protected inAndOutputNames: (keyof AccessStatusBadgeComponent & keyof this)[] = ['object'];

  protected getComponentName(): string {
    return 'AccessStatusBadgeComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/object-collection/shared/badges/access-status-badge/access-status-badge.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./access-status-badge.component`);
  }
}

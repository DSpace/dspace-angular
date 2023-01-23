import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { TypeBadgeComponent } from './type-badge.component';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { BadgesComponent } from '../badges.component';

/**
 * Themed wrapper for TypeBadgeComponent
 */
@Component({
  selector: 'ds-themed-type-badge',
  styleUrls: [],
  templateUrl: '../../../../shared/theme-support/themed.component.html',
})
export class ThemedTypeBadgeComponent extends ThemedComponent<TypeBadgeComponent> {
  @Input() object: DSpaceObject;

  protected inAndOutputNames: (keyof TypeBadgeComponent & keyof this)[] = ['object'];

  protected getComponentName(): string {
    return 'TypeBadgeComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/object-list/badges/type-badge/type-badge.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./type-badge.component`);
  }
}

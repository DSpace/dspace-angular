import {
  Component,
  Input,
} from '@angular/core';

import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { ThemedComponent } from '../../../../theme-support/themed.component';
import { TypeBadgeComponent } from './type-badge.component';

/**
 * Themed wrapper for TypeBadgeComponent
 */
@Component({
  selector: 'ds-type-badge',
  styleUrls: [],
  templateUrl: '../../../../theme-support/themed.component.html',
  standalone: true,
  imports: [TypeBadgeComponent],
})
export class ThemedTypeBadgeComponent extends ThemedComponent<TypeBadgeComponent> {
  @Input() object: DSpaceObject;

  protected inAndOutputNames: (keyof TypeBadgeComponent & keyof this)[] = ['object'];

  protected getComponentName(): string {
    return 'TypeBadgeComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/object-collection/shared/badges/type-badge/type-badge.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./type-badge.component`);
  }
}

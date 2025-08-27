import {
  Component,
  Input,
} from '@angular/core';
import { Context } from 'src/app/core/shared/context.model';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { BadgesComponent } from './badges.component';

/**
 * Themed wrapper for BadgesComponent
 */
@Component({
  selector: 'ds-badges',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    BadgesComponent,
  ],
})
export class ThemedBadgesComponent extends ThemedComponent<BadgesComponent> {
  @Input() object: DSpaceObject;
  @Input() context: Context;
  @Input() showAccessStatus: boolean;

  protected inAndOutputNames: (keyof BadgesComponent & keyof this)[] = ['object', 'context', 'showAccessStatus'];

  protected getComponentName(): string {
    return 'BadgesComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/object-collection/shared/badges/badges.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./badges.component`);
  }
}

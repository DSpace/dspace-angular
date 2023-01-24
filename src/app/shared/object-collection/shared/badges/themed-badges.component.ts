import { Component, Input } from '@angular/core';
import { BadgesComponent } from './badges.component';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { MyDspaceItemStatusType } from './my-dspace-status-badge/my-dspace-item-status-type';

/**
 * Themed wrapper for BadgesComponent
 */
@Component({
  selector: 'ds-themed-badges',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedBadgesComponent extends ThemedComponent<BadgesComponent> {
  @Input() object: DSpaceObject;
  @Input() myDSpaceStatus: MyDspaceItemStatusType;

  protected inAndOutputNames: (keyof BadgesComponent & keyof this)[] = ['object', 'myDSpaceStatus'];

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

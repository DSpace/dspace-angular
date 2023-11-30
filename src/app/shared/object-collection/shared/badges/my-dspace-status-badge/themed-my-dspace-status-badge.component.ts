import { Component, Input } from '@angular/core';
import { Context } from 'src/app/core/shared/context.model';
import { ThemedComponent } from '../../../../theme-support/themed.component';
import { MyDSpaceStatusBadgeComponent } from './my-dspace-status-badge.component';

/**
 * Themed wrapper for MyDSpaceStatusBadge
 */
@Component({
  selector: 'ds-themed-my-dspace-status-badge',
  styleUrls: [],
  templateUrl: '../../../../theme-support/themed.component.html',
})
export class ThemedMyDSpaceStatusBadgeComponent extends ThemedComponent<MyDSpaceStatusBadgeComponent> {
  @Input() context: Context;

  protected inAndOutputNames: (keyof MyDSpaceStatusBadgeComponent & keyof this)[] = ['context'];

  protected getComponentName(): string {
    return 'MyDSpaceStatusBadgeComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/object-collection/shared/badges/my-dspace-status-badge/my-dspace-status-badge.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./my-dspace-status-badge.component`);
  }
}

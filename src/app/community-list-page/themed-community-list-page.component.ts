import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { CommunityListPageComponent } from './community-list-page.component';

/**
 * Themed wrapper for CommunityListPageComponent
 */
@Component({
  selector: 'ds-community-list-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    CommunityListPageComponent,
  ],
})
export class ThemedCommunityListPageComponent extends ThemedComponent<CommunityListPageComponent> {
  protected getComponentName(): string {
    return 'CommunityListPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/community-list-page/community-list-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./community-list-page.component`);
  }

}

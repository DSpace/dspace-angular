import { Component } from '@angular/core';
import { TopLevelCommunityListComponent } from './top-level-community-list.component';
import { ThemedComponent } from '../../shared/theme-support/themed.component';

@Component({
    selector: 'ds-themed-top-level-community-list',
    styleUrls: [],
    templateUrl: '../../shared/theme-support/themed.component.html',
    standalone: true
})
export class ThemedTopLevelCommunityListComponent extends ThemedComponent<TopLevelCommunityListComponent> {
  protected inAndOutputNames: (keyof TopLevelCommunityListComponent & keyof this)[];

  protected getComponentName(): string {
    return 'TopLevelCommunityListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/home-page/top-level-community-list/top-level-community-list.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./top-level-community-list.component`);
  }

}

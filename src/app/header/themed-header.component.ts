import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/initial-menus-state';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { CommunityListPageComponent } from '../community-list-page/community-list-page.component';
import { HeaderComponent } from './header.component';

/**
 * Themed wrapper for HeaderComponent
 */
@Component({
  selector: 'ds-themed-header',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedHeaderComponent extends ThemedComponent<HeaderComponent> {
  protected getComponentName(): string {
    return 'HeaderComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/header/header.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./header.component`);
  }
}

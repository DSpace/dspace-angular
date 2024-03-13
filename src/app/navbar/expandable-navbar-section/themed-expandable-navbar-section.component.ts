import { Component } from '@angular/core';

import { MenuID } from '../../shared/menu/menu-id.model';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { ExpandableNavbarSectionComponent } from './expandable-navbar-section.component';

/**
 * Themed wrapper for ExpandableNavbarSectionComponent
 */
@Component({
  selector: 'ds-themed-expandable-navbar-section',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
@rendersSectionForMenu(MenuID.PUBLIC, true)
export class ThemedExpandableNavbarSectionComponent  extends ThemedComponent<ExpandableNavbarSectionComponent> {
  protected getComponentName(): string {
    return 'ExpandableNavbarSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/navbar/expandable-navbar-section/expandable-navbar-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./expandable-navbar-section.component`);
  }
}

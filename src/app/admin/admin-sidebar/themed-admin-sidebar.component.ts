import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { Observable } from 'rxjs';

/**
 * Themed wrapper for AdminSidebarComponent
 */
@Component({
  selector: 'ds-themed-admin-sidebar',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedAdminSidebarComponent extends ThemedComponent<AdminSidebarComponent> {

  /**
   * Observable that emits the width of the sidebar when expanded
   */
  @Input() expandedSidebarWidth$: Observable<string>;

  /**
   * Observable that emits the width of the sidebar when collapsed
   */
  @Input() collapsedSidebarWidth$: Observable<string>;

  protected inAndOutputNames: (keyof AdminSidebarComponent & keyof this)[] = ['collapsedSidebarWidth$', 'expandedSidebarWidth$'];

  protected getComponentName(): string {
    return 'AdminSidebarComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/admin/admin-sidebar/admin-sidebar.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./admin-sidebar.component');
  }
}

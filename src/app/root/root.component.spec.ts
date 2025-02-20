import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedAdminSidebarComponent } from '../admin/admin-sidebar/themed-admin-sidebar.component';
import { ThemedBreadcrumbsComponent } from '../breadcrumbs/themed-breadcrumbs.component';
import { NotificationsBoardComponent } from '../core/notifications/notifications-board/notifications-board.component';
import { CSSVariableServiceStub } from '../core/utilities/testing/css-variable-service.stub';
import { HostWindowServiceStub } from '../core/utilities/testing/host-window-service.stub';
import { MenuServiceStub } from '../core/utilities/testing/menu-service.stub';
import { ThemedFooterComponent } from '../footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../header-nav-wrapper/themed-header-navbar-wrapper.component';
import { HostWindowService } from '../shared/host-window.service';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { MenuService } from '../shared/menu/menu.service';
import { RouterMock } from '../shared/mocks/router.mock';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { SystemWideAlertBannerComponent } from '../system-wide-alert/alert-banner/system-wide-alert-banner.component';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        RootComponent,
      ],
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: MenuService, useValue: new MenuServiceStub() },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RootComponent, {
        remove: {
          imports: [
            ThemedAdminSidebarComponent,
            SystemWideAlertBannerComponent,
            ThemedHeaderNavbarWrapperComponent,
            ThemedBreadcrumbsComponent,
            ThemedLoadingComponent,
            ThemedFooterComponent,
            NotificationsBoardComponent,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

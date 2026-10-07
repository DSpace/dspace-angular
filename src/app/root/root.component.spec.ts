import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Router,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedAdminSidebarComponent } from '../admin/admin-sidebar/themed-admin-sidebar.component';
import { ThemedBreadcrumbsComponent } from '../breadcrumbs/themed-breadcrumbs.component';
import { ThemedFooterComponent } from '../footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../header-nav-wrapper/themed-header-navbar-wrapper.component';
import { HostWindowService } from '../shared/host-window.service';
import { LiveRegionComponent } from '../shared/live-region/live-region.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { MenuService } from '../shared/menu/menu.service';
import { RouterMock } from '../shared/mocks/router.mock';
import { NotificationsBoardComponent } from '../shared/notifications/notifications-board/notifications-board.component';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { CSSVariableServiceStub } from '../shared/testing/css-variable-service.stub';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../shared/testing/menu-service.stub';
import { SystemWideAlertBannerComponent } from '../system-wide-alert/alert-banner/system-wide-alert-banner.component';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        RootComponent,
      ],
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: MenuService, useValue: new MenuServiceStub() },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
      ],
    }).overrideComponent(RootComponent, {
      add: {
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
      remove: {
        imports: [
          LiveRegionComponent,
          ThemedAdminSidebarComponent,
          SystemWideAlertBannerComponent,
          ThemedHeaderNavbarWrapperComponent,
          ThemedBreadcrumbsComponent,
          ThemedLoadingComponent,
          ThemedFooterComponent,
          NotificationsBoardComponent,
        ],
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('skip-to-main-content link', () => {
    it('should be rendered as an anchor pointing to #main-content', () => {
      const skipLink = fixture.nativeElement.querySelector('#skip-to-main-content');
      expect(skipLink).not.toBeNull();
      expect(skipLink.tagName).toBe('A');
      expect(skipLink.getAttribute('fragment')).toBe('main-content');
    });

    it('should target a <main> element with tabindex="-1" so the anchor can move focus', () => {
      const mainContent = fixture.nativeElement.querySelector('#main-content');
      expect(mainContent).not.toBeNull();
      expect(mainContent.tagName).toBe('MAIN');
      expect(mainContent.getAttribute('tabindex')).toBe('-1');
    });
  });
});

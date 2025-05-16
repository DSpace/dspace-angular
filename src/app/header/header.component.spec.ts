import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { LocaleService } from '../core/locale/locale.service';
import { ThemedSearchNavbarComponent } from '../search-navbar/themed-search-navbar.component';
import { ThemedAuthNavMenuComponent } from '../shared/auth-nav-menu/themed-auth-nav-menu.component';
import { HostWindowService } from '../shared/host-window.service';
import { ImpersonateNavbarComponent } from '../shared/impersonate-navbar/impersonate-navbar.component';
import { ThemedLangSwitchComponent } from '../shared/lang-switch/themed-lang-switch.component';
import { MenuService } from '../shared/menu/menu.service';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../shared/testing/menu-service.stub';
import { ContextHelpToggleComponent } from './context-help-toggle/context-help-toggle.component';
import { HeaderComponent } from './header.component';

let comp: HeaderComponent;
let fixture: ComponentFixture<HeaderComponent>;

describe('HeaderComponent', () => {
  const menuService = new MenuServiceStub();

  const languageList = ['en;q=1', 'it;q=0.9', 'de;q=0.8', 'fr;q=0.7'];
  const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
    getLanguageCodeList: of(languageList),
  });


  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        HeaderComponent,
      ],
      providers: [
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: MenuService, useValue: menuService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HeaderComponent, {
        remove: { imports: [ ThemedLangSwitchComponent, ThemedSearchNavbarComponent, ContextHelpToggleComponent, ThemedAuthNavMenuComponent, ImpersonateNavbarComponent] },
      })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    spyOn(menuService, 'getMenuTopSections').and.returnValue(of([]));

    fixture = TestBed.createComponent(HeaderComponent);

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the toggle button is clicked', () => {

    beforeEach(() => {
      spyOn(menuService, 'toggleMenu');
      const navbarToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
      navbarToggler.triggerEventHandler('click', null);
    });

    it('should call toggleMenu on the menuService', () => {
      expect(menuService.toggleMenu).toHaveBeenCalled();
    });

  });
});

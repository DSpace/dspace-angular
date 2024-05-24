// ... test imports
import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { storeModuleConfig } from '../app.reducer';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { SiteDataService } from '../core/data/site-data.service';
import { LocaleService } from '../core/locale/locale.service';
import { Site } from '../core/shared/site.model';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { AuthorizationDataServiceStub } from '../shared/testing/authorization-service.stub';
// Load the implementations that should be tested
import { FooterComponent } from './footer.component';

let comp: FooterComponent;
let compAny: any;
let fixture: ComponentFixture<FooterComponent>;
let de: DebugElement;
let el: HTMLElement;
const site: Site = Object.assign(new Site(), {
  id: 'test-site',
  _links: {
    self: { href: 'test-site-href' },
  },
  metadata: {
    'cris.cms.footer': [
      {
        value: 'Test footer',
        language: 'en',
      },
    ],
  },
});
const siteService = jasmine.createSpyObj('siteService', {
  find: of(site),
});
const localeServiceStub = {
  getCurrentLanguageCode(): string {
    return 'en';
  },
};

let notifyInfoService = {
  isCoarConfigEnabled: () => of(true),
};

describe('Footer component', () => {
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot({}, storeModuleConfig), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      })],
      declarations: [FooterComponent], // declare the test component
      providers: [
        FooterComponent,
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        { provide: NotifyInfoService, useValue: notifyInfoService },
        { provide: SiteDataService, useValue: siteService },
        { provide: LocaleService, useValue: localeServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    comp = fixture.componentInstance;
    compAny = comp as any;
    // query for the title <p> by CSS element selector
    de = fixture.debugElement.query(By.css('p'));
    el = de.nativeElement;
  });

  it('should create footer', inject([FooterComponent], (app: FooterComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));

  it('should render TextSectionComponent', () => {
    comp.showTopFooter = true;
    fixture.detectChanges();
    const textComponent = fixture.debugElement.queryAll(By.css('ds-themed-text-section'));
    expect(textComponent).toHaveSize(1);
  });

  it('should set showPrivacyPolicy to the value of environment.info.enablePrivacyStatement', () => {
    expect(comp.showPrivacyPolicy).toBe(environment.info.enablePrivacyStatement);
  });

  it('should set showEndUserAgreement to the value of environment.info.enableEndUserAgreement', () => {
    expect(comp.showEndUserAgreement).toBe(environment.info.enableEndUserAgreement);
  });

  describe('showCookieSettings', () => {
    it('should call cookies.showSettings() if cookies is defined', () => {
      const cookies = jasmine.createSpyObj('cookies', ['showSettings']);
      compAny.cookies = cookies;
      comp.showCookieSettings();
      expect(cookies.showSettings).toHaveBeenCalled();
    });

    it('should not call cookies.showSettings() if cookies is undefined', () => {
      compAny.cookies = undefined;
      expect(() => comp.showCookieSettings()).not.toThrow();
    });

    it('should return false', () => {
      expect(comp.showCookieSettings()).toBeFalse();
    });
  });

  describe('when coarLdnEnabled is true', () => {
    beforeEach(() => {
      spyOn(notifyInfoService, 'isCoarConfigEnabled').and.returnValue(of(true));
      fixture.detectChanges();
    });

    it('should set coarLdnEnabled based on notifyInfoService', () => {
      expect(comp.coarLdnEnabled).toBeTruthy();
      // Check if COAR Notify section is rendered
      const notifySection = fixture.debugElement.query(By.css('.notify-enabled'));
      expect(notifySection).toBeTruthy();
    });

    it('should redirect to info/coar-notify-support', () => {
      // Check if the link to the COAR Notify support page is present
      const routerLink = fixture.debugElement.query(By.css('a[routerLink="info/coar-notify-support"].coar-notify-support-route'));
      expect(routerLink).toBeTruthy();
    });

    it('should have an img tag with the class "n-coar" when coarLdnEnabled is true', fakeAsync(() => {
      // Check if the img tag with the class "n-coar" is present
      const imgTag = fixture.debugElement.query(By.css('.notify-enabled img.n-coar'));
      expect(imgTag).toBeTruthy();
    }));
  });
});

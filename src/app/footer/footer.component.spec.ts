import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../config/app-config.interface';
import { environment } from '../../environments/environment.test';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { SiteDataService } from '../core/data/site-data.service';
import { LocaleService } from '../core/locale/locale.service';
import { Site } from '../core/shared/site.model';
import { ThemedTextSectionComponent } from '../shared/explore/section-component/text-section/themed-text-section.component';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { AuthorizationDataServiceStub } from '../shared/testing/authorization-service.stub';
import { FooterComponent } from './footer.component';

let comp: FooterComponent;
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
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        { provide: NotifyInfoService, useValue: notifyInfoService },
        { provide: SiteDataService, useValue: siteService },
        { provide: LocaleService, useValue: localeServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: APP_CONFIG, useValue: environment },
      ],
    }).overrideComponent(FooterComponent, {
      remove: {
        imports: [ThemedTextSectionComponent],
      },
    });
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    comp = fixture.componentInstance;
  });

  it('should create footer', () => {
    expect(comp).toBeDefined();
  });

  it('should render TextSectionComponent', () => {
    comp.showTopFooter = true;
    fixture.detectChanges();
    const textComponent = fixture.debugElement.queryAll(By.css('ds-text-section'));
    expect(textComponent).toHaveSize(1);
  });

  it('should set showPrivacyPolicy to the value of environment.info.enablePrivacyStatement', () => {
    comp.ngOnInit();
    expect(comp.showPrivacyPolicy).toBe(environment.info.enablePrivacyStatement);
  });

  it('should set showEndUserAgreement to the value of environment.info.enableEndUserAgreement', () => {
    comp.ngOnInit();
    expect(comp.showEndUserAgreement).toBe(environment.info.enableEndUserAgreement);
  });

  describe('showCookieSettings', () => {
    it('should call cookies.showSettings() if cookies is defined', () => {
      const cookies = jasmine.createSpyObj('cookies', ['showSettings']);
      comp.cookies = cookies;
      comp.openCookieSettings();
      expect(cookies.showSettings).toHaveBeenCalled();
    });

    it('should not call cookies.showSettings() if cookies is undefined', () => {
      comp.cookies = undefined;
      expect(() => comp.openCookieSettings()).not.toThrow();
    });

    it('should return false', () => {
      expect(comp.openCookieSettings()).toBeFalse();
    });
  });

  describe('when coarLdnEnabled is true', () => {
    beforeEach(() => {
      spyOn(notifyInfoService, 'isCoarConfigEnabled').and.returnValue(of(true));
      fixture.detectChanges();
    });

    it('should render COAR notify support link', () => {
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

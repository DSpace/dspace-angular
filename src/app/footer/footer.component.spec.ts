import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { NotifyInfoService } from '@dspace/core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../environments/environment.test';
import { FooterComponent } from './footer.component';
import { provideMockStore } from '@ngrx/store/testing';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { LocaleService } from '@dspace/core/locale/locale.service';

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let localeService: any;

const TEST_MODEL = new ResourceType('testmodel');
const languageList = ['en;q=1', 'de;q=0.8'];
const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
    getLanguageCodeList: of(languageList),
});

let notifyInfoService = {
  isCoarConfigEnabled: () => of(true),
};

const mockDataServiceMap: any = new Map([
  [TEST_MODEL.value, () => import('../core/testing/test-data-service.mock').then(m => m.TestDataService)],
]);

describe('Footer component', () => {
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        FooterComponent,
        provideMockStore({
          initialState: {
            index: {
            }
          }
        }),
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        { provide: NotifyInfoService, useValue: notifyInfoService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: mockDataServiceMap },
      ],
    });
  }));

  // synchronous beforeEach
  beforeEach(() => {
    localeService = TestBed.inject(LocaleService);
    localeService.getCurrentLanguageCode.and.returnValue(of('en'));
    fixture = TestBed.createComponent(FooterComponent);
    comp = fixture.componentInstance;
  });

  it('should create footer', inject([FooterComponent], (app: FooterComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));


  it('should set showPrivacyPolicy to the value of environment.info.enablePrivacyStatement', () => {
    comp.ngOnInit();
    expect(comp.showPrivacyPolicy).toBe(environment.info.enablePrivacyStatement);
  });

  it('should set showEndUserAgreement to the value of environment.info.enableEndUserAgreement', () => {
    comp.ngOnInit();
    expect(comp.showEndUserAgreement).toBe(environment.info.enableEndUserAgreement);
  });

  describe('openCookieSettings', () => {
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

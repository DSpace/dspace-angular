import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { NotifyInfoService } from '@dspace/core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { SiteDataService } from '@dspace/core/data/site-data.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment.test';
import { FooterComponent } from './footer.component';

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;

// O rodapé base lê o texto do CMS do Site no idioma atual, então os dois serviços
// precisam existir mesmo que o template do tema não mostre esse texto.
const mockSite = {
  firstMetadataValue: (key: string, options: any) => 'Sample Footer CMS Content',
};
const mockSiteDataService = {
  find: () => of(mockSite),
};
const mockLocaleService = {
  getCurrentLanguageCode: () => of('en'),
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
        FooterComponent,
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        { provide: NotifyInfoService, useValue: notifyInfoService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: SiteDataService, useValue: mockSiteDataService },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: APP_CONFIG, useValue: environment },
      ],
    });
  }));

  // synchronous beforeEach
  beforeEach(() => {
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

  // O tema troca o rodapé do DSpace pelo do Ministério: não há bloco de COAR
  // Notify nem links de privacidade, mesmo com os recursos ligados no config.
  describe('when coarLdnEnabled is true', () => {
    beforeEach(() => {
      spyOn(notifyInfoService, 'isCoarConfigEnabled').and.returnValue(of(true));
      fixture.detectChanges();
    });

    it('should not render the COAR notify section, which the theme footer omits', () => {
      expect(fixture.debugElement.query(By.css('.notify-enabled'))).toBeNull();
      expect(fixture.debugElement.query(By.css('img.n-coar'))).toBeNull();
    });
  });

  describe('theme content', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should open every social link in a new tab without exposing the opener', () => {
      const links = fixture.debugElement.queryAll(By.css('.footer-social a'));
      expect(links.length).toBe(4);
      links.forEach((link) => {
        expect(link.attributes.target).toBe('_blank');
        expect(link.attributes.rel).toBe('noopener noreferrer');
        expect(link.attributes['aria-label']).toBeTruthy();
      });
    });

    it('should render the organization contact block', () => {
      expect(fixture.debugElement.query(By.css('.footer-org-name'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('a[href^="mailto:"]'))).toBeTruthy();
    });
  });
});

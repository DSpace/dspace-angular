import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { CookieServiceMock } from '../../shared/mocks/cookie.service.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { routeServiceStub } from '../../shared/testing/route-service.stub';
import { AuthService } from '../auth/auth.service';
import { CookieService } from '../services/cookie.service';
import { RouteService } from '../services/route.service';
import { NativeWindowRef } from '../services/window.service';
import {
  LANG_COOKIE,
  LANG_ORIGIN,
  LocaleService,
} from './locale.service';

describe('LocaleService test suite', () => {
  let service: LocaleService;
  let serviceAsAny: any;
  let cookieService: CookieService;
  let translateService: TranslateService;
  let window;
  let spyOnGet;
  let spyOnSet;
  let authService;
  let routeService;
  let document;

  authService = jasmine.createSpyObj('AuthService', {
    isAuthenticated: jasmine.createSpy('isAuthenticated'),
    isAuthenticationLoaded: jasmine.createSpy('isAuthenticationLoaded'),
  });

  const langList = ['en', 'xx', 'de'];

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: AuthService, userValue: authService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Document, useValue: document },
      ],
    });
  }));

  beforeEach(() => {
    cookieService = TestBed.inject(CookieService);
    translateService = TestBed.inject(TranslateService);
    routeService = TestBed.inject(RouteService);
    window = new NativeWindowRef();
    document = { documentElement: { lang: 'en' } };
    service = new LocaleService(window, cookieService, translateService, authService, routeService, document);
    serviceAsAny = service;
    spyOnGet = spyOn(cookieService, 'get');
    spyOnSet = spyOn(cookieService, 'set');
  });

  describe('getCurrentLanguageCode', () => {
    beforeEach(() => {
      spyOn(translateService, 'getLangs').and.returnValue(langList);
    });

    it('should return the language saved on cookie if it\'s a valid & active language', () => {
      spyOnGet.and.returnValue('de');
      expect(service.getCurrentLanguageCode()).toBe('de');
    });

    it('should return the default language if the cookie language is disabled', () => {
      spyOnGet.and.returnValue('disabled');
      expect(service.getCurrentLanguageCode()).toBe('en');
    });

    it('should return the default language if the cookie language does not exist', () => {
      spyOnGet.and.returnValue('does-not-exist');
      expect(service.getCurrentLanguageCode()).toBe('en');
    });

    it('should return language from browser setting', () => {
      spyOn(translateService, 'getBrowserLang').and.returnValue('xx');
      expect(service.getCurrentLanguageCode()).toBe('xx');
    });

    it('should return default language from config', () => {
      spyOn(translateService, 'getBrowserLang').and.returnValue('fr');
      expect(service.getCurrentLanguageCode()).toBe('en');
    });
  });

  describe('getLanguageCodeFromCookie', () => {
    it('should return language from cookie', () => {
      spyOnGet.and.returnValue('de');
      expect(service.getLanguageCodeFromCookie()).toBe('de');
    });

  });

  describe('saveLanguageCodeToCookie', () => {
    it('should save language to cookie', () => {
      service.saveLanguageCodeToCookie('en');
      expect(spyOnSet).toHaveBeenCalledWith(LANG_COOKIE, 'en');
    });
  });

  describe('setCurrentLanguageCode', () => {
    beforeEach(() => {
      spyOn(service, 'saveLanguageCodeToCookie');
      spyOn(translateService, 'use');
    });

    it('should set the given language', () => {
      service.setCurrentLanguageCode('xx');
      expect(translateService.use).toHaveBeenCalledWith('xx');
      expect(service.saveLanguageCodeToCookie).toHaveBeenCalledWith('xx');
    });

    it('should set the current language', () => {
      spyOn(service, 'getCurrentLanguageCode').and.returnValue('es');
      service.setCurrentLanguageCode();
      expect(translateService.use).toHaveBeenCalledWith('es');
      expect(service.saveLanguageCodeToCookie).toHaveBeenCalledWith('es');
    });

    it('should set the current language on the html tag', () => {
      spyOn(service, 'getCurrentLanguageCode').and.returnValue('es');
      service.setCurrentLanguageCode();
      expect((service as any).document.documentElement.lang).toEqual('es');
    });
  });

  describe('', () => {
    it('should set quality to current language list', () => {
      const langListWithQuality = ['en;q=1', 'xx;q=0.9', 'de;q=0.8'];
      spyOn(service, 'setQuality').and.returnValue(langListWithQuality);
      service.setQuality(langList, LANG_ORIGIN.BROWSER, false);
      expect(service.setQuality).toHaveBeenCalledWith(langList, LANG_ORIGIN.BROWSER, false);
    });

    it('should return the list of language with quality factor', () => {
      spyOn(service, 'getLanguageCodeList');
      service.getLanguageCodeList();
      expect(service.getLanguageCodeList).toHaveBeenCalled();
    });
  });
});

import { async, TestBed } from '@angular/core/testing';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CookieService } from '../services/cookie.service';
import { MockCookieService } from '../../shared/mocks/mock-cookie.service';
import { MockTranslateLoader } from '../../shared/mocks/mock-translate-loader';
import { LANG_COOKIE, LocaleService } from './locale.service';

describe('LocaleService test suite', () => {
  let service: LocaleService;
  let serviceAsAny: any;
  let cookieService: CookieService;
  let translateService: TranslateService;
  let spyOnGet;
  let spyOnSet;

  const config: any = {
    defaultLanguage: 'en'
  };

  const langList = ['en', 'it', 'de'];

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      providers: [
        { provide: CookieService, useValue: new MockCookieService() },
      ]
    });
  }));

  beforeEach(() => {
    cookieService = TestBed.get(CookieService);
    translateService = TestBed.get(TranslateService);
    service = new LocaleService(config, cookieService, translateService);
    serviceAsAny = service;
    spyOnGet = spyOn(cookieService, 'get');
    spyOnSet = spyOn(cookieService, 'set');
  });

  describe('getCurrentLanguageCode', () => {
    it('should return language saved on cookie', () => {
      spyOnGet.and.returnValue('de');
      expect(service.getCurrentLanguageCode()).toBe('de');
    });

    describe('', () => {
      beforeEach(() => {
        spyOn(translateService, 'getLangs').and.returnValue(langList);
      });

      it('should return language from browser setting', () => {
        spyOn(translateService, 'getBrowserLang').and.returnValue('it');
        expect(service.getCurrentLanguageCode()).toBe('it');
      });

      it('should return default language from config', () => {
        spyOn(translateService, 'getBrowserLang').and.returnValue('fr');
        expect(service.getCurrentLanguageCode()).toBe('en');
      });
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
      service.setCurrentLanguageCode('it');
      expect(translateService.use).toHaveBeenCalledWith( 'it');
      expect(service.saveLanguageCodeToCookie).toHaveBeenCalledWith('it');
    });

    it('should set the current language', () => {
      spyOn(service, 'getCurrentLanguageCode').and.returnValue('es');
      service.setCurrentLanguageCode();
      expect(translateService.use).toHaveBeenCalledWith( 'es');
      expect(service.saveLanguageCodeToCookie).toHaveBeenCalledWith('es');
    });
  });
});

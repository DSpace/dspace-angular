import { TestBed } from '@angular/core/testing';
import { BrowserKlaroService, COOKIE_MDFIELD } from './browser-klaro.service';
import { getMockTranslateService } from '../mocks/translate.service.mock';
import { of as observableOf } from 'rxjs';
import { RestResponse } from '../../core/cache/response.models';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { CookieService } from '../../core/services/cookie.service';
import { getTestScheduler } from 'jasmine-marbles';
import { MetadataValue } from '../../core/shared/metadata.models';
import {clone, cloneDeep} from 'lodash';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import {createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$} from '../remote-data.utils';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';

describe('BrowserKlaroService', () => {
  const trackingIdProp = 'google.analytics.key';
  const trackingIdTestValue = 'mock-tracking-id';
  const googleAnalytics = 'google-analytics';
  let translateService;
  let ePersonService;
  let authService;
  let cookieService;

  let user;
  let service: BrowserKlaroService;
  let configurationDataService: ConfigurationDataService;
  const createConfigSuccessSpy = (...values: string[]) => jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: trackingIdProp,
      values: values,
    }),
  });

  let mockConfig;
  let appName;
  let purpose;
  let testKey;
  let findByPropertyName;

  beforeEach(() => {
    user = new EPerson();

    translateService = getMockTranslateService();
    ePersonService = jasmine.createSpyObj('ePersonService', {
      createPatchFromCache: observableOf([]),
      patch: observableOf(new RestResponse(true, 200, 'Ok'))
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      getAuthenticatedUserFromStore: observableOf(user)
    });
    configurationDataService = createConfigSuccessSpy(trackingIdTestValue);
    findByPropertyName = configurationDataService.findByPropertyName;
    cookieService = jasmine.createSpyObj('cookieService', {
      get: '{%22token_item%22:true%2C%22impersonation%22:true%2C%22redirect%22:true%2C%22language%22:true%2C%22klaro%22:true%2C%22has_agreed_end_user%22:true%2C%22google-analytics%22:true}',
      set: () => {
        /* empty */
      }
    });

    TestBed.configureTestingModule({
      providers: [
        BrowserKlaroService,
        {
          provide: TranslateService,
          useValue: translateService
        },
        {
          provide: EPersonDataService,
          useValue: ePersonService,
        },
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: CookieService,
          useValue: cookieService
        },
        {
          provide: ConfigurationDataService,
          useValue: configurationDataService
        }
      ]
    });
    service = TestBed.inject(BrowserKlaroService);
    appName = 'testName';
    purpose = 'test purpose';
    testKey = 'this.is.a.fake.message.key';

    mockConfig = {
      translations: {
        en: {
          purposes: {},
          test: {
            testeritis: testKey
          }
        }
      },
      services: [{
        name: appName,
        purposes: [purpose]
      },{
        name: googleAnalytics,
        purposes: [purpose]
      }],

    };

    service.klaroConfig = mockConfig;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize with user', () => {
    beforeEach(() => {
      spyOn((service as any), 'getUser$').and.returnValue(observableOf(user));
      translateService.get.and.returnValue(observableOf('loading...'));
      spyOn(service, 'addAppMessages');
      spyOn((service as any), 'initializeUser');
      spyOn(service, 'translateConfiguration');
    });
    it('to call the initialize user method and other methods', () => {
      service.initialize();
      expect((service as any).initializeUser).toHaveBeenCalledWith(user);
      expect(service.addAppMessages).toHaveBeenCalled();
      expect(service.translateConfiguration).toHaveBeenCalled();
    });
  });

  describe('to not call the initialize user method, but the other methods', () => {
    beforeEach(() => {
      spyOn((service as any), 'getUser$').and.returnValue(observableOf(undefined));
      translateService.get.and.returnValue(observableOf('loading...'));
      spyOn(service, 'addAppMessages');
      spyOn((service as any), 'initializeUser');
      spyOn(service, 'translateConfiguration');
    });
    it('to call all ', () => {
      service.initialize();
      expect((service as any).initializeUser).not.toHaveBeenCalledWith(user);
      expect(service.addAppMessages).toHaveBeenCalled();
      expect(service.translateConfiguration).toHaveBeenCalled();
    });
  });

  it('addAppMessages', () => {
    service.addAppMessages();
    expect(mockConfig.translations.en[appName]).toBeDefined();
    expect(mockConfig.translations.en.purposes[purpose]).toBeDefined();
  });

  it('translateConfiguration', () => {
    service.translateConfiguration();
    expect((service as any).translateService.instant).toHaveBeenCalledWith(testKey);
  });

  describe('initializeUser when there is a metadata field value', () => {
    beforeEach(() => {
      user.setMetadata(COOKIE_MDFIELD, undefined, '{}');
      spyOn(service, 'restoreSettingsForUsers');
    });

    it('initializeUser', () => {
      (service as any).initializeUser(user);
      expect(service.restoreSettingsForUsers).toHaveBeenCalledWith(user);
    });
  });

  describe('initializeUser when there is no metadata field value but there is an anonymous cookie', () => {
    const cookie = '{test: \'testt\'}';
    beforeEach(() => {
      (service as any).cookieService.get.and.returnValue(cookie);
      spyOn(service, 'updateSettingsForUsers');
    });

    it('initializeUser', () => {
      (service as any).initializeUser(user);
      expect((service as any).cookieService.set).toHaveBeenCalledWith(service.getStorageName(user.uuid), cookie);
      expect(service.updateSettingsForUsers).toHaveBeenCalledWith(user);
    });
  });

  describe('getUser$ when there is no one authenticated', () => {
    beforeEach(() => {
      (service as any).authService.isAuthenticated.and.returnValue(observableOf(false));
    });
    it('should return undefined', () => {
      getTestScheduler().expectObservable((service as any).getUser$()).toBe('(a|)', { a: undefined });
    });
  });

  describe('getUser$ when there someone is authenticated', () => {
    beforeEach(() => {
      (service as any).authService.isAuthenticated.and.returnValue(observableOf(true));
      (service as any).authService.getAuthenticatedUserFromStore.and.returnValue(observableOf(user));
    });
    it('should return the user', () => {
      getTestScheduler().expectObservable((service as any).getUser$()).toBe('(a|)', { a: user });
    });
  });

  describe('getSettingsForUser', () => {
    const cookieConsentString = '{test: \'testt\'}';
    beforeEach(() => {
      user.metadata = {};
      user.metadata[COOKIE_MDFIELD] = [Object.assign(new MetadataValue(), { value: cookieConsentString })];
      spyOn(JSON, 'parse');
    });
    it('should return the cookie consents object', () => {
      service.getSettingsForUser(user);
      expect(JSON.parse).toHaveBeenCalledWith(cookieConsentString);
    });
  });

  describe('setSettingsForUser when there are changes', () => {
    const cookieConsent = { test: 'testt' };
    const cookieConsentString = '{test: \'testt\'}';
    const operation = { op: 'add', path: 'metadata/dc.agreements.cookie', value: cookieConsentString };
    let updatedUser;

    beforeEach(() => {
      updatedUser = cloneDeep(user);

      spyOn(updatedUser, 'setMetadata');
      spyOn(JSON, 'stringify').and.returnValue(cookieConsentString);
      ePersonService.createPatchFromCache.and.returnValue(observableOf([operation]));
    });
    it('should call patch on the data service', () => {
      service.setSettingsForUser(updatedUser, cookieConsent);
      expect(updatedUser.setMetadata).toHaveBeenCalledWith(COOKIE_MDFIELD, undefined, cookieConsentString);
      expect(ePersonService.patch).toHaveBeenCalledWith(updatedUser, [operation]);
    });
  });

  describe('setSettingsForUser when there are no changes', () => {
    const cookieConsent = { test: 'testt' };
    const cookieConsentString = '{test: \'testt\'}';
    let updatedUser;

    beforeEach(() => {
      updatedUser = cloneDeep(user);

      spyOn(updatedUser, 'setMetadata');
      spyOn(JSON, 'stringify').and.returnValue(cookieConsentString);
      ePersonService.createPatchFromCache.and.returnValue(observableOf([]));
    });
    it('should not call patch on the data service', () => {
      service.setSettingsForUser(updatedUser, cookieConsent);
      expect(updatedUser.setMetadata).toHaveBeenCalledWith(COOKIE_MDFIELD, undefined, cookieConsentString);
      expect(ePersonService.patch).not.toHaveBeenCalled();
    });
  });

  describe('initialize google analytics configuration', () => {
    let GOOGLE_ANALYTICS_KEY;
    beforeEach(() => {
      GOOGLE_ANALYTICS_KEY = clone((service as any).GOOGLE_ANALYTICS_KEY);
      configurationDataService.findByPropertyName = findByPropertyName;
      spyOn((service as any), 'getUser$').and.returnValue(observableOf(user));
      translateService.get.and.returnValue(observableOf('loading...'));
      spyOn(service, 'addAppMessages');
      spyOn((service as any), 'initializeUser');
      spyOn(service, 'translateConfiguration');
    });
    it('should not filter googleAnalytics when servicesToHide are empty', () => {
      const filteredConfig = (service as any).filterConfigServices([]);
      expect(filteredConfig).toContain(jasmine.objectContaining({name: googleAnalytics}));
    });
    it('should filter services using names passed as servicesToHide', () => {
      const filteredConfig = (service as any).filterConfigServices([googleAnalytics]);
      expect(filteredConfig).not.toContain(jasmine.objectContaining({name: googleAnalytics}));
    });
    it('should have been initialized with googleAnalytics', () => {
      service.initialize();
      expect(service.klaroConfig.services).toContain(jasmine.objectContaining({name: googleAnalytics}));
    });
    it('should filter googleAnalytics when empty configuration is retrieved', () => {
      configurationDataService.findByPropertyName = jasmine.createSpy().withArgs(GOOGLE_ANALYTICS_KEY).and.returnValue(
        createSuccessfulRemoteDataObject$({
          ... new ConfigurationProperty(),
          name: googleAnalytics,
          values: [],
        }));

      service.initialize();
      expect(service.klaroConfig.services).not.toContain(jasmine.objectContaining({name: googleAnalytics}));
    });
    it('should filter googleAnalytics when an error occurs', () => {
      configurationDataService.findByPropertyName = jasmine.createSpy().withArgs(GOOGLE_ANALYTICS_KEY).and.returnValue(
        createFailedRemoteDataObject$('Erro while loading GA')
      );
      service.initialize();
      expect(service.klaroConfig.services).not.toContain(jasmine.objectContaining({name: googleAnalytics}));
    });
    it('should filter googleAnalytics when an invalid payload is retrieved', () => {
      configurationDataService.findByPropertyName = jasmine.createSpy().withArgs(GOOGLE_ANALYTICS_KEY).and.returnValue(
        createSuccessfulRemoteDataObject$(null)
      );
      service.initialize();
      expect(service.klaroConfig.services).not.toContain(jasmine.objectContaining({name: googleAnalytics}));
    });
  });
});

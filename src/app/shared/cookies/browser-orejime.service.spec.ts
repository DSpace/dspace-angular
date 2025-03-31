import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { AuthService } from '../../core/auth/auth.service';
import { RestResponse } from '../../core/cache/response.models';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { CookieService } from '../../core/services/cookie.service';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { getMockTranslateService } from '../mocks/translate.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../remote-data.utils';
import {
  BrowserOrejimeService,
  COOKIE_MDFIELD,
} from './browser-orejime.service';
import { ANONYMOUS_STORAGE_NAME_OREJIME } from './orejime-configuration';

describe('BrowserOrejimeService', () => {
  const trackingIdProp = 'google.analytics.key';
  const trackingIdTestValue = 'mock-tracking-id';
  const matomoTrackingId = 'matomo-tracking-id';
  const googleAnalytics = 'google-analytics';
  const recaptchaProp = 'registration.verification.enabled';
  const recaptchaValue = 'true';
  let translateService;
  let ePersonService;
  let authService;
  let cookieService;

  let user;
  let service: BrowserOrejimeService;
  let configurationDataService: ConfigurationDataService;
  const createConfigSuccessSpy = (...values: string[]) => jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: recaptchaProp,
      values: values,
    }),
  });

  let mockConfig;
  let appName;
  let purpose;
  let testKey;
  let findByPropertyName;

  beforeEach(() => {
    user = Object.assign(new EPerson(), {
      uuid: 'test-user',
    });

    translateService = getMockTranslateService();
    ePersonService = jasmine.createSpyObj('ePersonService', {
      createPatchFromCache: observableOf([]),
      patch: observableOf(new RestResponse(true, 200, 'Ok')),
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      getAuthenticatedUserFromStore: observableOf(user),
    });
    configurationDataService = createConfigSuccessSpy(recaptchaValue);
    findByPropertyName = configurationDataService.findByPropertyName;
    cookieService = jasmine.createSpyObj('cookieService', {
      get: '{"authentication":true,"preferences":true,"acknowledgement":true,"google-analytics":true}',
      set: () => {
        /* empty */
      },
    });

    TestBed.configureTestingModule({
      providers: [
        BrowserOrejimeService,
        {
          provide: TranslateService,
          useValue: translateService,
        },
        {
          provide: EPersonDataService,
          useValue: ePersonService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: CookieService,
          useValue: cookieService,
        },
        {
          provide: ConfigurationDataService,
          useValue: configurationDataService,
        },
      ],
    });
    service = TestBed.inject(BrowserOrejimeService);
    appName = 'testName';
    purpose = 'test purpose';
    testKey = 'this.is.a.fake.message.key';

    mockConfig = {
      translations: {
        zz: {
          purposes: {},
          test: {
            testeritis: testKey,
          },
        },
      },
      apps: [{
        name: appName,
        purposes: [purpose],
      }, {
        name: googleAnalytics,
        purposes: [purpose],
      }],

    };

    service.orejimeConfig = mockConfig;
    service.createCategories();
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
    expect(mockConfig.translations.zz[appName]).toBeDefined();
    expect(mockConfig.translations.zz.purposes[purpose]).toBeDefined();
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

  describe('getSavedPreferences', () => {
    let scheduler: TestScheduler;
    beforeEach(() => {
      scheduler = getTestScheduler();
    });

    describe('when no user is autheticated', () => {
      beforeEach(() => {
        spyOn(service as any, 'getUser$').and.returnValue(observableOf(undefined));
      });

      it('should return the cookie consents object', () => {
        scheduler.schedule(() => service.getSavedPreferences().subscribe());
        scheduler.flush();

        expect(cookieService.get).toHaveBeenCalledWith(ANONYMOUS_STORAGE_NAME_OREJIME);
      });
    });

    describe('when user is autheticated', () => {
      beforeEach(() => {
        spyOn(service as any, 'getUser$').and.returnValue(observableOf(user));
      });

      it('should return the cookie consents object', () => {
        scheduler.schedule(() => service.getSavedPreferences().subscribe());
        scheduler.flush();

        expect(cookieService.get).toHaveBeenCalledWith('orejime-' + user.uuid);
      });
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
    let REGISTRATION_VERIFICATION_ENABLED_KEY;
    let MATOMO_ENABLED;
    beforeEach(() => {
      GOOGLE_ANALYTICS_KEY = clone((service as any).GOOGLE_ANALYTICS_KEY);
      REGISTRATION_VERIFICATION_ENABLED_KEY = clone((service as any).REGISTRATION_VERIFICATION_ENABLED_KEY);
      MATOMO_ENABLED = clone((service as any).MATOMO_ENABLED);
      spyOn((service as any), 'getUser$').and.returnValue(observableOf(user));
      translateService.get.and.returnValue(observableOf('loading...'));
      spyOn(service, 'addAppMessages');
      spyOn((service as any), 'initializeUser');
      spyOn(service, 'translateConfiguration');
      configurationDataService.findByPropertyName = findByPropertyName;
    });

    it('should not filter googleAnalytics when appsToHide is empty', () => {
      const filteredConfig = (service as any).filterConfigApps([]);
      expect(filteredConfig).toContain(jasmine.objectContaining({ name: googleAnalytics }));
    });
    it('should filter apps using names passed as appsToHide', () => {
      const filteredConfig = (service as any).filterConfigApps([googleAnalytics]);
      expect(filteredConfig).not.toContain(jasmine.objectContaining({ name: googleAnalytics }));
    });
    it('should have been initialized with googleAnalytics', () => {
      configurationDataService.findByPropertyName = jasmine.createSpy('configurationDataService').and.returnValue(
        createSuccessfulRemoteDataObject$({
          ...new ConfigurationProperty(),
          name: trackingIdProp,
          values: [googleAnalytics],
        }),
      );
      service.initialize();
      expect(service.orejimeConfig.apps).toContain(jasmine.objectContaining({ name: googleAnalytics }));
    });
    it('should filter googleAnalytics when empty configuration is retrieved', () => {
      configurationDataService.findByPropertyName =
        jasmine.createSpy()
          .withArgs(GOOGLE_ANALYTICS_KEY)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: googleAnalytics,
              values: [],
            },
            ),
          )
          .withArgs(REGISTRATION_VERIFICATION_ENABLED_KEY)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: trackingIdTestValue,
              values: ['false'],
            }),
          )
          .withArgs(MATOMO_ENABLED)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: matomoTrackingId,
              values: ['false'],
            }),
          );

      service.initialize();
      expect(service.orejimeConfig.apps).not.toContain(jasmine.objectContaining({ name: googleAnalytics }));
    });
    it('should filter googleAnalytics when an error occurs', () => {
      configurationDataService.findByPropertyName =
        jasmine.createSpy()
          .withArgs(GOOGLE_ANALYTICS_KEY).and.returnValue(
            createFailedRemoteDataObject$('Error while loading GA'),
          )
          .withArgs(REGISTRATION_VERIFICATION_ENABLED_KEY)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: trackingIdTestValue,
              values: ['false'],
            }),
          )
          .withArgs(MATOMO_ENABLED)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: matomoTrackingId,
              values: ['false'],
            }),
          );
      service.initialize();
      expect(service.orejimeConfig.apps).not.toContain(jasmine.objectContaining({ name: googleAnalytics }));
    });
    it('should filter googleAnalytics when an invalid payload is retrieved', () => {
      configurationDataService.findByPropertyName =
        jasmine.createSpy()
          .withArgs(GOOGLE_ANALYTICS_KEY).and.returnValue(
            createSuccessfulRemoteDataObject$(null),
          )
          .withArgs(REGISTRATION_VERIFICATION_ENABLED_KEY)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: trackingIdTestValue,
              values: ['false'],
            }),
          )
          .withArgs(MATOMO_ENABLED)
          .and
          .returnValue(
            createSuccessfulRemoteDataObject$({
              ... new ConfigurationProperty(),
              name: matomoTrackingId,
              values: ['false'],
            }),
          );
      service.initialize();
      expect(service.orejimeConfig.apps).not.toContain(jasmine.objectContaining({ name: googleAnalytics }));
    });
  });
});

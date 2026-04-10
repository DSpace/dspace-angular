import {
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { of } from 'rxjs';

import { AppConfig } from '../../config/app-config.interface';
import { AuthService } from '../core/auth/auth.service';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { CookieService } from '../core/services/cookie.service';
import { OrejimeServiceStub } from '../shared/cookies/orejime.service.stub';
import { CookieServiceMock } from '../shared/mocks/cookie.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import { AuthServiceStub } from '../shared/testing/auth-service.stub';
import {
  ACCESSIBILITY_COOKIE,
  ACCESSIBILITY_SETTINGS_METADATA_KEY,
  AccessibilitySettings,
  AccessibilitySettingsFormValues,
  AccessibilitySettingsService,
  FullAccessibilitySettings,
} from './accessibility-settings.service';


describe('accessibilitySettingsService', () => {
  let service: AccessibilitySettingsService;
  let cookieService: CookieServiceMock;
  let authService: AuthServiceStub;
  let ePersonService: EPersonDataService;
  let orejimeService: OrejimeServiceStub;
  let appConfig: AppConfig;

  beforeEach(() => {
    cookieService = new CookieServiceMock();
    authService = new AuthServiceStub();
    orejimeService = new OrejimeServiceStub();
    appConfig = { accessibility: { cookieExpirationDuration: 10 } } as AppConfig;

    orejimeService.getSavedPreferences.and.returnValue(of({ accessibility: true }));

    ePersonService = jasmine.createSpyObj('ePersonService', {
      createPatchFromCache: of([{
        op: 'add',
        value: null,
      }]),
      patch: of({}),
    });

    service = new AccessibilitySettingsService(
      cookieService as unknown as CookieService,
      authService as unknown as AuthService,
      ePersonService,
      orejimeService,
      appConfig,
    );
  });

  describe('get', () => {
    it('should return the setting if it is set', () => {
      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.getAll = jasmine.createSpy('getAll').and.returnValue(of(settings));

      service.get('notificationTimeOut', 'default').subscribe(value =>
        expect(value).toEqual('1000'),
      );
    });

    it('should return the default value if the setting is not set', () => {
      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.getAll = jasmine.createSpy('getAll').and.returnValue(of(settings));

      service.get('liveRegionTimeOut', 'default').subscribe(value =>
        expect(value).toEqual('default'),
      );
    });
  });

  describe('getAsNumber', () => {
    it('should return the setting as number if the value for the setting can be parsed to a number', () => {
      service.get = jasmine.createSpy('get').and.returnValue(of('1000'));

      service.getAsNumber('notificationTimeOut').subscribe(value =>
        expect(value).toEqual(1000),
      );
    });

    it('should return the default value if no value is set for the setting', () => {
      service.get = jasmine.createSpy('get').and.returnValue(of(null));

      service.getAsNumber('notificationTimeOut', 123).subscribe(value =>
        expect(value).toEqual(123),
      );
    });

    it('should return the default value if the value for the setting can not be parsed to a number', () => {
      service.get = jasmine.createSpy('get').and.returnValue(of('text'));

      service.getAsNumber('notificationTimeOut', 123).subscribe(value =>
        expect(value).toEqual(123),
      );
    });
  });

  describe('getAll', () => {
    it('should attempt to get the settings from metadata first', () => {
      service.getAllSettingsFromAuthenticatedUserMetadata =
        jasmine.createSpy('getAllSettingsFromAuthenticatedUserMetadata').and.returnValue(of({ }));

      service.getAll().subscribe();
      expect(service.getAllSettingsFromAuthenticatedUserMetadata).toHaveBeenCalled();
    });

    it('should attempt to get the settings from the cookie if the settings from metadata are empty', () => {
      service.getAllSettingsFromAuthenticatedUserMetadata =
        jasmine.createSpy('getAllSettingsFromAuthenticatedUserMetadata').and.returnValue(of({ }));

      service.getAllSettingsFromCookie = jasmine.createSpy('getAllSettingsFromCookie').and.returnValue({ });

      service.getAll().subscribe();
      expect(service.getAllSettingsFromCookie).toHaveBeenCalled();
    });

    it('should not attempt to get the settings from the cookie if the settings from metadata are not empty', () => {
      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.getAllSettingsFromAuthenticatedUserMetadata =
        jasmine.createSpy('getAllSettingsFromAuthenticatedUserMetadata').and.returnValue(of(settings));

      service.getAllSettingsFromCookie = jasmine.createSpy('getAllSettingsFromCookie').and.returnValue({ });

      service.getAll().subscribe();
      expect(service.getAllSettingsFromCookie).not.toHaveBeenCalled();
    });

    it('should return an empty object if both are empty', () => {
      service.getAllSettingsFromAuthenticatedUserMetadata =
        jasmine.createSpy('getAllSettingsFromAuthenticatedUserMetadata').and.returnValue(of({ }));

      service.getAllSettingsFromCookie = jasmine.createSpy('getAllSettingsFromCookie').and.returnValue({ });

      service.getAll().subscribe(value => expect(value).toEqual({}));
    });
  });

  describe('getAllSettingsFromCookie', () => {
    it('should retrieve the settings from the cookie', () => {
      cookieService.get = jasmine.createSpy();

      service.getAllSettingsFromCookie();
      expect(cookieService.get).toHaveBeenCalledWith(ACCESSIBILITY_COOKIE);
    });
  });

  describe('getAllSettingsFromAuthenticatedUserMetadata', () => {
    it('should retrieve all settings from the user\'s metadata', () => {
      const settings = { 'liveRegionTimeOut': '1000' };

      const user = new EPerson();
      user.setMetadata(ACCESSIBILITY_SETTINGS_METADATA_KEY, null, JSON.stringify(settings));

      authService.getAuthenticatedUserFromStoreIfAuthenticated =
        jasmine.createSpy('getAuthenticatedUserFromStoreIfAuthenticated').and.returnValue(of(user));

      service.getAllSettingsFromAuthenticatedUserMetadata().subscribe(value =>
        expect(value).toEqual(settings),
      );
    });
  });

  describe('set', () => {
    it('should correctly update the chosen setting', () => {
      service.updateSettings = jasmine.createSpy('updateSettings');

      service.set('liveRegionTimeOut', '500');
      expect(service.updateSettings).toHaveBeenCalledWith({ liveRegionTimeOut: '500' });
    });
  });

  describe('setSettings', () => {
    beforeEach(() => {
      service.setSettingsInCookie = jasmine.createSpy('setSettingsInCookie').and.returnValue(of('cookie'));
    });

    it('should attempt to set settings in metadata', () => {
      service.setSettingsInAuthenticatedUserMetadata =
        jasmine.createSpy('setSettingsInAuthenticatedUserMetadata').and.returnValue(of('failed'));

      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.setSettings(settings).subscribe();
      expect(service.setSettingsInAuthenticatedUserMetadata).toHaveBeenCalledWith(settings);
    });

    it('should set settings in cookie if metadata failed', () => {
      service.setSettingsInAuthenticatedUserMetadata =
        jasmine.createSpy('setSettingsInAuthenticatedUserMetadata').and.returnValue(of(false));

      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.setSettings(settings).subscribe();
      expect(service.setSettingsInCookie).toHaveBeenCalled();
    });

    it('should not set settings in cookie if metadata succeeded', () => {
      service.setSettingsInAuthenticatedUserMetadata =
        jasmine.createSpy('setSettingsInAuthenticatedUserMetadata').and.returnValue(of('metadata'));

      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.setSettings(settings).subscribe();
      expect(service.setSettingsInCookie).not.toHaveBeenCalled();
    });

    it('should return \'metadata\' if settings are stored in metadata', () => {
      service.setSettingsInAuthenticatedUserMetadata =
        jasmine.createSpy('setSettingsInAuthenticatedUserMetadata').and.returnValue(of('metadata'));

      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.setSettings(settings).subscribe(value =>
        expect(value).toEqual('metadata'),
      );
    });

    it('should return \'cookie\' if settings are stored in cookie', () => {
      service.setSettingsInAuthenticatedUserMetadata =
        jasmine.createSpy('setSettingsInAuthenticatedUserMetadata').and.returnValue(of(false));

      const settings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.setSettings(settings).subscribe(value =>
        expect(value).toEqual('cookie'),
      );
    });
  });

  describe('updateSettings', () => {
    it('should call setSettings with the updated settings', () => {
      const beforeSettings: AccessibilitySettings = {
        notificationTimeOut: '1000',
      };

      service.getAll = jasmine.createSpy('getAll').and.returnValue(of(beforeSettings));
      service.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));

      const newSettings: AccessibilitySettings = {
        liveRegionTimeOut: '2000',
      };

      const combinedSettings: AccessibilitySettings = {
        notificationTimeOut: '1000',
        liveRegionTimeOut: '2000',
      };

      service.updateSettings(newSettings).subscribe();
      expect(service.setSettings).toHaveBeenCalledWith(combinedSettings);
    });
  });

  describe('setSettingsInAuthenticatedUserMetadata', () => {
    beforeEach(() => {
      service.setSettingsInMetadata = jasmine.createSpy('setSettingsInMetadata').and.returnValue(of(null));
    });

    it('should store settings in metadata when the user is authenticated', fakeAsync(() => {
      const user = new EPerson();
      authService.getAuthenticatedUserFromStoreIfAuthenticated = jasmine.createSpy().and.returnValue(of(user));

      service.setSettingsInAuthenticatedUserMetadata({}).subscribe();
      flush();

      expect(service.setSettingsInMetadata).toHaveBeenCalled();
    }));

    it('should emit "failed" when the user is not authenticated', fakeAsync(() => {
      authService.getAuthenticatedUserFromStoreIfAuthenticated = jasmine.createSpy().and.returnValue(of(null));

      service.setSettingsInAuthenticatedUserMetadata({})
        .subscribe(value => expect(value).toEqual('failed'));
      flush();

      expect(service.setSettingsInMetadata).not.toHaveBeenCalled();
    }));
  });

  describe('setSettingsInMetadata', () => {
    const ePerson = new EPerson();

    beforeEach(() => {
      ePerson.setMetadata = jasmine.createSpy('setMetadata');
      ePerson.removeMetadata = jasmine.createSpy('removeMetadata');
    });

    it('should set the settings in metadata', () => {
      service.setSettingsInMetadata(ePerson, { ['liveRegionTimeOut']: '500' }).subscribe();
      expect(ePerson.setMetadata).toHaveBeenCalled();
    });

    it('should remove the metadata when the settings are emtpy', () => {
      service.setSettingsInMetadata(ePerson, {}).subscribe();
      expect(ePerson.setMetadata).not.toHaveBeenCalled();
      expect(ePerson.removeMetadata).toHaveBeenCalled();
    });

    it('should create a patch with the metadata changes', () => {
      service.setSettingsInMetadata(ePerson, { ['liveRegionTimeOut']: '500' }).subscribe();
      expect(ePersonService.createPatchFromCache).toHaveBeenCalled();
    });

    it('should send the patch request', () => {
      service.setSettingsInMetadata(ePerson, { ['liveRegionTimeOut']: '500' }).subscribe();
      expect(ePersonService.patch).toHaveBeenCalled();
    });

    it('should emit "metadata" when the update succeeded', fakeAsync(() => {
      ePersonService.patch = jasmine.createSpy().and.returnValue(createSuccessfulRemoteDataObject$({}));

      service.setSettingsInMetadata(ePerson, { ['liveRegionTimeOut']: '500' })
        .subscribe(value => {
          expect(value).toEqual('metadata');
        });

      flush();
    }));

    it('should emit "failed" when the update failed', fakeAsync(() => {
      ePersonService.patch = jasmine.createSpy().and.returnValue(createFailedRemoteDataObject$());

      service.setSettingsInMetadata(ePerson, { ['liveRegionTimeOut']: '500' })
        .subscribe(value => {
          expect(value).toEqual('failed');
        });

      flush();
    }));
  });

  describe('setSettingsInCookie', () => {
    beforeEach(() => {
      cookieService.set = jasmine.createSpy('set');
      cookieService.remove = jasmine.createSpy('remove');
    });

    it('should fail to store settings in the cookie when the user has not accepted the cookie', fakeAsync(() => {
      orejimeService.getSavedPreferences.and.returnValue(of({ accessibility: false }));

      service.setSettingsInCookie({ ['liveRegionTimeOut']: '500' }).subscribe(value => {
        expect(value).toEqual('failed');
      });
      flush();
      expect(cookieService.set).not.toHaveBeenCalled();
    }));

    it('should store the settings in a cookie', fakeAsync(() => {
      service.setSettingsInCookie({ ['liveRegionTimeOut']: '500' }).subscribe(value => {
        expect(value).toEqual('cookie');
      });
      flush();
      expect(cookieService.set).toHaveBeenCalled();
    }));

    it('should remove the cookie when the settings are empty', fakeAsync(() => {
      service.setSettingsInCookie({}).subscribe(value => {
        expect(value).toEqual('cookie');
      });

      flush();

      expect(cookieService.set).not.toHaveBeenCalled();
      expect(cookieService.remove).toHaveBeenCalled();
    }));
  });

  describe('convertFormValuesToStoredValues', () => {
    it('should reset the notificationTimeOut when timeOut is enabled but set to "0"', () => {
      const formValues: AccessibilitySettingsFormValues = {
        notificationTimeOutEnabled: true,
        notificationTimeOut: '0',
        liveRegionTimeOut: null,
      };

      const storedValues: FullAccessibilitySettings = service.convertFormValuesToStoredValues(formValues);
      expect('notificationTimeOut' in storedValues).toBeFalse();
    });
  });

  it('should keep the notificationTimeOut when timeOut is enabled and differs from "0"', () => {
    const formValues: AccessibilitySettingsFormValues = {
      notificationTimeOutEnabled: true,
      notificationTimeOut: '3',
      liveRegionTimeOut: null,
    };

    const storedValues: FullAccessibilitySettings = service.convertFormValuesToStoredValues(formValues);
    expect('notificationTimeOut' in storedValues).toBeTrue();
  });
});

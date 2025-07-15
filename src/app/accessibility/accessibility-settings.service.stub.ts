import { of } from 'rxjs';

import { AccessibilitySettingsService } from './accessibility-settings.service';

export function getAccessibilitySettingsServiceStub(): AccessibilitySettingsService {
  return new AccessibilitySettingsServiceStub() as unknown as AccessibilitySettingsService;
}

export class AccessibilitySettingsServiceStub {
  getAllAccessibilitySettingKeys = jasmine.createSpy('getAllAccessibilitySettingKeys').and.returnValue([]);

  get = jasmine.createSpy('get').and.returnValue(of(null));

  getAsNumber = jasmine.createSpy('getAsNumber').and.returnValue(of(0));

  getAll = jasmine.createSpy('getAll').and.returnValue(of({}));

  getAllSettingsFromCookie = jasmine.createSpy('getAllSettingsFromCookie').and.returnValue({});

  getAllSettingsFromAuthenticatedUserMetadata = jasmine.createSpy('getAllSettingsFromAuthenticatedUserMetadata')
    .and.returnValue(of({}));

  set = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));

  updateSettings = jasmine.createSpy('updateSettings').and.returnValue(of('cookie'));

  setSettingsInAuthenticatedUserMetadata = jasmine.createSpy('setSettingsInAuthenticatedUserMetadata')
    .and.returnValue(of(false));

  setSettingsInMetadata = jasmine.createSpy('setSettingsInMetadata').and.returnValue(of(false));

  setSettingsInCookie = jasmine.createSpy('setSettingsInCookie');

  getInputType = jasmine.createSpy('getInputType').and.returnValue('text');

  convertFormValuesToStoredValues = jasmine.createSpy('convertFormValuesToStoredValues').and.returnValue({});

  convertStoredValuesToFormValues = jasmine.createSpy('convertStoredValuesToFormValues').and.returnValue({});

  getDefaultValue = jasmine.createSpy('getPlaceholder').and.returnValue('placeholder');

  isValid = jasmine.createSpy('isValid').and.returnValue(true);

  formValuesValid = jasmine.createSpy('allValid').and.returnValue(true);
}

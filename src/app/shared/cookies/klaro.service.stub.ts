import { of } from 'rxjs';

export class KlaroServiceStub {
  initialize = jasmine.createSpy('initialize');

  showSettings = jasmine.createSpy('showSettings');

  getSavedPreferences = jasmine.createSpy('getSavedPreferences').and.returnValue(of({}));
}

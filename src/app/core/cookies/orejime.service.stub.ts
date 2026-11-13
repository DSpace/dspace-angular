import {
  BehaviorSubject,
  of,
} from 'rxjs';

export class OrejimeServiceStub {
  initialize = jasmine.createSpy('initialize');

  showSettings = jasmine.createSpy('showSettings');

  getSavedPreferences = jasmine.createSpy('getSavedPreferences').and.returnValue(of({}));

  watchConsentUpdates = jasmine.createSpy('watchConsentUpdates').and.returnValue(of(null));

  consentsUpdates$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
}

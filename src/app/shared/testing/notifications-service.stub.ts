import { NotificationOptions } from '../notifications/models/notification-options.model';
import {BehaviorSubject} from 'rxjs';

export class NotificationsServiceStub {

  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
  info = jasmine.createSpy('info');
  warning = jasmine.createSpy('warning');
  remove = jasmine.createSpy('remove');
  removeAll = jasmine.createSpy('removeAll');
  process = jasmine.createSpy('process');

  private _claimedProfile = new BehaviorSubject<any>(true);

  get claimedProfile(): BehaviorSubject<any> {
    return this._claimedProfile;
  }

  private getDefaultOptions(): NotificationOptions {
    return new NotificationOptions();
  }
}

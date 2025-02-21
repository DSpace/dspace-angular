import { NotificationOptions } from '@dspace/core';

export class NotificationsServiceStub {

  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
  info = jasmine.createSpy('info');
  warning = jasmine.createSpy('warning');
  remove = jasmine.createSpy('remove');
  removeAll = jasmine.createSpy('removeAll');

  private getDefaultOptions(): NotificationOptions {
    return new NotificationOptions();
  }
}

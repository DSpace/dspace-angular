import { of } from 'rxjs';

import { LiveRegionService } from './live-region.service';

export function getLiveRegionServiceStub(): LiveRegionService {
  return new LiveRegionServiceStub() as unknown as LiveRegionService;
}

export class LiveRegionServiceStub {
  getMessages = jasmine.createSpy('getMessages').and.returnValue(
    ['Message One', 'Message Two'],
  );

  getMessages$ = jasmine.createSpy('getMessages$').and.returnValue(
    of(['Message One', 'Message Two']),
  );

  addMessage = jasmine.createSpy('addMessage').and.returnValue('messageId');

  clear = jasmine.createSpy('clear');

  clearMessageByUUID = jasmine.createSpy('clearMessageByUUID');

  getLiveRegionVisibility = jasmine.createSpy('getLiveRegionVisibility').and.returnValue(false);

  setLiveRegionVisibility = jasmine.createSpy('setLiveRegionVisibility');

  getMessageTimeOutMs = jasmine.createSpy('getMessageTimeOutMs').and.returnValue(30000);

  setMessageTimeOutMs = jasmine.createSpy('setMessageTimeOutMs');
}

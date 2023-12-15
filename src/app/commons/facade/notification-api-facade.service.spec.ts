import { TestBed } from '@angular/core/testing';

import { NotificationApiFacadeService } from './notification-api-facade.service';

describe('NotificationApiFacadeService', () => {
  let service: NotificationApiFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationApiFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

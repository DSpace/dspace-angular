import { TestBed } from '@angular/core/testing';

import { NotifyInfoService } from './notify-info.service';

describe('NotifyInfoService', () => {
  let service: NotifyInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

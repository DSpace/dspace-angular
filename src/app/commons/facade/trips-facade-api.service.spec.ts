import { TestBed } from '@angular/core/testing';

import { TripsFacadeApiService } from './trips-facade-api.service';

describe('TripsFacadeApiService', () => {
  let service: TripsFacadeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripsFacadeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

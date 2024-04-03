import { TestBed } from '@angular/core/testing';

import { DatadogRumService } from './datadog-rum.service';

describe('DatadogRumService', () => {
  let service: DatadogRumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatadogRumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

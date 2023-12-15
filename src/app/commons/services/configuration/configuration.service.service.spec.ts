import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service.service';

describe('ConfigurationServiceService', () => {
  let service: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ExternalLoginService } from './external-login.service';

describe('ExternalLoginService', () => {
  let service: ExternalLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

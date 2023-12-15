import { TestBed } from '@angular/core/testing';

import { ProfileApiFacadeService } from './profile-api-facade.service';

describe('ProfileApiFacadeService', () => {
  let service: ProfileApiFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileApiFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RegistrationDataResolver } from './registration-data.resolver';

describe('RegistrationDataResolver', () => {
  let resolver: RegistrationDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RegistrationDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

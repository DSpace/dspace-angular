import { TestBed } from '@angular/core/testing';

import { KlaroService } from './klaro.service';

describe('KlaroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KlaroService = TestBed.get(KlaroService);
    expect(service).toBeTruthy();
  });
});

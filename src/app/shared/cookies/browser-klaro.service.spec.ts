import { TestBed } from '@angular/core/testing';

import { BrowserKlaroService } from './browser-klaro.service';

describe('KlaroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrowserKlaroService = TestBed.get(BrowserKlaroService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SearchcomponentService } from './searchcomponent.service';

describe('SearchcomponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchcomponentService = TestBed.get(SearchcomponentService);
    expect(service).toBeTruthy();
  });
});

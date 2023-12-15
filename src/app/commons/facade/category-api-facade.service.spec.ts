import { TestBed } from '@angular/core/testing';

import { CategoryApiFacadeService } from './category-api-facade.service';

describe('CategoryApiFacadeService', () => {
  let service: CategoryApiFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryApiFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

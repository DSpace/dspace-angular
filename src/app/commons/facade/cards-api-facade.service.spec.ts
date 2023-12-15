import { TestBed } from '@angular/core/testing';

import { CardsApiFacadeService } from './cards-api-facade.service';

describe('CardsApiFacadeService', () => {
  let service: CardsApiFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsApiFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

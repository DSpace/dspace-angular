import { TestBed } from '@angular/core/testing';
import { LuckySearchService } from './lucky-search.service';
import { SearchManager } from '../core/browse/search-manager';
import { SearchServiceStub } from '../shared/testing/search-service.stub';

describe('LuckySearchService', () => {
  let service: LuckySearchService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SearchManager,  useValue: new SearchServiceStub('/search')},
      ],
    });
    service = TestBed.inject(LuckySearchService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

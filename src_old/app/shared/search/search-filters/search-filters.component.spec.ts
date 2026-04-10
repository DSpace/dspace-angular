import {
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { SearchFilterServiceStub } from '@dspace/core/testing/search-filter-service.stub';
import { SearchServiceStub } from '@dspace/core/testing/search-service.stub';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { SearchService } from '../search.service';
import { SearchFilterService } from './search-filter.service';
import { SearchFiltersComponent } from './search-filters.component';

describe('SearchFiltersComponent', () => {
  let comp: SearchFiltersComponent;
  let fixture: ComponentFixture<SearchFiltersComponent>;

  let searchService: SearchServiceStub;
  let searchFilters: SearchFilterServiceStub;

  beforeEach(waitForAsync(() => {
    searchService = new SearchServiceStub();
    searchFilters = new SearchFilterServiceStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        NoopAnimationsModule,
        SearchFiltersComponent,
      ],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: SearchFilterService, useValue: searchFilters },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).overrideComponent(SearchFiltersComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFiltersComponent);
    comp = fixture.componentInstance; // SearchFiltersComponent test instance
    fixture.detectChanges();
  });

  describe('when the getSearchLink method is called', () => {
    beforeEach(() => {
      spyOn(searchService, 'getSearchLink');
      comp.getSearchLink();
    });

    it('should call getSearchLink on the searchService', () => {
      expect(searchService.getSearchLink).toHaveBeenCalled();
    });
  });

});

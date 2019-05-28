import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureSearchComponentTestingModule } from './search-page.component.spec';
import { SearchConfigurationService } from './search-service/search-configuration.service';

describe('FilteredSearchPageComponent', () => {
  let comp: FilteredSearchPageComponent;
  let fixture: ComponentFixture<FilteredSearchPageComponent>;
  let searchConfigService: SearchConfigurationService;

  beforeEach(async(() => {
    configureSearchComponentTestingModule(FilteredSearchPageComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredSearchPageComponent);
    comp = fixture.componentInstance;
    searchConfigService = (comp as any).searchConfigService;
    fixture.detectChanges();
  });

  describe('when fixedFilterQuery is defined', () => {
    const fixedFilterQuery = 'fixedFilterQuery';

    beforeEach(() => {
      spyOn(searchConfigService, 'updateFixedFilter').and.callThrough();
      comp.fixedFilterQuery = fixedFilterQuery;
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('should update the paginated search options', () => {
      expect(searchConfigService.updateFixedFilter).toHaveBeenCalledWith(fixedFilterQuery);
    });
  });

});

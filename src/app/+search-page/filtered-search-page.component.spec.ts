import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureSearchComponentTestingModule } from './search.component.spec';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';

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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { AdvancedSearchComponent } from './advanced-search.component';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { SearchService } from '../../../core/shared/search/search.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { FormBuilder } from '@angular/forms';
describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let builderService: FormBuilderService = getMockFormBuilderService();
  let searchService: SearchService;

  const searchServiceStub = {
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    getClearFiltersQueryParams: () => {
    },
    getSearchLink: () => {
    },
    getConfigurationSearchConfig: () => { },
    /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
  };
  const searchFiltersStub = {
    getSelectedValuesForFilter: (filter) =>
      []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvancedSearchComponent],
      providers: [
        FormBuilder,
        { provide: FormBuilderService, useValue: builderService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: SearchFilterService, useValue: searchFiltersStub },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: SearchService, useValue: searchServiceStub },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});

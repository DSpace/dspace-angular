import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { AdvancedSearchComponent } from './advanced-search.component';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { SearchService } from '../../../core/shared/search/search.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { FormBuilder } from '@angular/forms';
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';
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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvancedSearchComponent],
      providers: [
        FormBuilder,
        { provide: APP_CONFIG, useValue: environment },
        { provide: FormBuilderService, useValue: builderService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
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
  describe('when the getSearchLink method is called', () => {
    beforeEach(() => {
      spyOn(searchService, 'getSearchLink');
      (component as any).getSearchLink();
    });
  });
  describe('onSubmit', () => {
    let data = { filter: 'title', textsearch: 'demo', operator: 'equals' };
    describe('when selected format hasn\'t changed', () => {
      beforeEach(() => {
        component.onSubmit(data);
      });
    });
  });
});

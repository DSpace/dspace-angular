import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { AdvancedSearchComponent } from './advanced-search.component';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { SearchService } from '../../../core/shared/search/search.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';
import { RouterStub } from '../../testing/router.stub';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserOnlyMockPipe } from '../../testing/browser-only-mock.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let builderService: FormBuilderService = getMockFormBuilderService();
  let searchService: SearchService;
  let router;
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
      declarations: [AdvancedSearchComponent, BrowserOnlyMockPipe],
      imports: [FormsModule, RouterTestingModule, TranslateModule.forRoot(), BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: APP_CONFIG, useValue: environment },
        { provide: FormBuilderService, useValue: builderService },
        { provide: Router, useValue: new RouterStub() },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: SearchService, useValue: searchServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AdvancedSearchComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
  describe('when the getSearchLink method is called', () => {
    const data = { filter: 'title', textsearch: 'demo', operator: 'equals' };
    it('should call navigate on the router with the right searchlink and parameters when the filter is provided with a valid operator', () => {
      component.advSearchForm.get('textsearch').patchValue('1');
      component.advSearchForm.get('filter').patchValue('1');
      component.advSearchForm.get('operator').patchValue('1');

      component.onSubmit(data);
      expect(router.navigate).toHaveBeenCalledWith([undefined], {
        queryParams: { ['f.' + data.filter]: data.textsearch + ',' + data.operator },
        queryParamsHandling: 'merge'
      });

    });
  });
});

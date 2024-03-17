import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import {
  first,
  take,
} from 'rxjs/operators';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { PaginationServiceStub } from '../testing/pagination-service.stub';
import { EnumKeysPipe } from '../utils/enum-keys-pipe';
import { VarDirective } from '../utils/var.directive';
import { PageSizeSelectorComponent } from './page-size-selector.component';

describe('PageSizeSelectorComponent', () => {

  let comp: PageSizeSelectorComponent;
  let fixture: ComponentFixture<PageSizeSelectorComponent>;

  const pagination: PaginationComponentOptions = new PaginationComponentOptions();
  pagination.id = 'search-results-pagination';
  pagination.currentPage = 1;
  pagination.pageSize = 10;
  const sort: SortOptions = new SortOptions('score', SortDirection.DESC);

  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const paginatedSearchOptions = {
    query: queryParam,
    scope: scopeParam,
    pagination,
    sort,
  };

  const paginationService = new PaginationServiceStub(pagination, sort);

  const activatedRouteStub = {
    queryParams: observableOf({
      query: queryParam,
      scope: scopeParam,
    }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), PageSizeSelectorComponent, EnumKeysPipe, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: PaginationService, useValue: paginationService },
        {
          provide: SEARCH_CONFIG_SERVICE,
          useValue: {
            paginatedSearchOptions: observableOf(paginatedSearchOptions),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSizeSelectorComponent);
    comp = fixture.componentInstance;

    // SearchPageComponent test instance
    fixture.detectChanges();

  });

  it('it should show the size settings with the respective selectable options', (done) => {
    comp.paginationOptions$.pipe(first()).subscribe((options: PaginationComponentOptions) => {
      const pageSizeSetting = fixture.debugElement.query(By.css('div.page-size-settings'));
      expect(pageSizeSetting).not.toBeNull();
      const childElements = pageSizeSetting.queryAll(By.css('option'));
      expect(childElements.length).toEqual(options.pageSizeOptions.length);
      done();
    },
    );
  });

  it('should have the proper rpp value selected by default', (done) => {
    comp.paginationOptions$.pipe(take(1)).subscribe(() => {
      const pageSizeSetting = fixture.debugElement.query(By.css('div.page-size-settings'));
      const childElementToBeSelected = pageSizeSetting.query(By.css('option[value="10"]'));
      expect(childElementToBeSelected).not.toBeNull();
      expect(childElementToBeSelected.nativeElement.selected).toBeTrue();
      done();
    });
  });

});

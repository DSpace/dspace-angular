import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Item } from '../../../../core/shared/item.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../remote-data.utils';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { PaginationServiceStub } from '../../../testing/pagination-service.stub';
import { SearchConfigurationServiceStub } from '../../../testing/search-configuration-service.stub';
import { SearchFilterServiceStub } from '../../../testing/search-filter-service.stub';
import { SearchServiceStub } from '../../../testing/search-service.stub';
import { ObjectKeysPipe } from '../../../utils/object-keys-pipe';
import { AppliedFilter } from '../../models/applied-filter.model';
import { addOperatorToFilterValue } from '../../search.utils';
import { SearchLabelComponent } from './search-label.component';

describe('SearchLabelComponent', () => {
  let comp: SearchLabelComponent;
  let fixture: ComponentFixture<SearchLabelComponent>;

  let route: ActivatedRouteStub;
  let searchConfigurationService: SearchConfigurationServiceStub;
  let searchFilterService: SearchFilterServiceStub;
  let paginationService: PaginationServiceStub;

  const searchLink = '/search';
  let appliedFilter: AppliedFilter;
  let initialRouteParams: Params;
  let pagination: PaginationComponentOptions;
  let itemDataService: jasmine.SpyObj<ItemDataService>;
  let dsoNameService: jasmine.SpyObj<DSONameService>;

  function init(): void {
    appliedFilter = Object.assign(new AppliedFilter(), {
      filter: 'author',
      operator: 'authority',
      value: '1282121b-5394-4689-ab93-78d537764052',
      label: 'Odinson, Thor',
    });
    initialRouteParams = {
      'query': '',
      'spc.page': '1',
      'f.author': addOperatorToFilterValue(appliedFilter.value, appliedFilter.operator),
      'f.has_content_in_original_bundle': addOperatorToFilterValue('true', 'equals'),
    };
    pagination = Object.assign(new PaginationComponentOptions(), {
      id: 'page-id',
      currentPage: 1,
      pageSize: 20,
    });
  }

  beforeEach(waitForAsync(async () => {
    init();
    route = new ActivatedRouteStub(initialRouteParams);
    searchConfigurationService = new SearchConfigurationServiceStub();
    searchFilterService = new SearchFilterServiceStub();
    paginationService = new PaginationServiceStub(pagination);
    itemDataService = jasmine.createSpyObj('ItemDataService', {
      findById: createSuccessfulRemoteDataObject$({}),
    });
    dsoNameService = jasmine.createSpyObj('DSONameService', {
      getName: 'Thor Odinson',
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NoopAnimationsModule,
        FormsModule,
        ObjectKeysPipe,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: DSONameService, useValue: dsoNameService },
      ],
    }).overrideComponent(SearchLabelComponent, {
      remove: {
        imports: [RouterLink],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLabelComponent);
    comp = fixture.componentInstance;
    comp.appliedFilter = appliedFilter;
    fixture.detectChanges();
  }));

  it('should set filter value to the name from dsoNameService when operator is authority and item is found', waitForAsync(() => {
    const id = '1282121b-5394-4689-ab93-78d537764052';
    const name = 'Thor Odinson';
    const item = { id, name };

    itemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(item as Item));
    dsoNameService.getName.and.returnValue(name);

    comp.appliedFilter = { filter: 'author', operator: 'authority', value: id, label: 'Odinson, Thor' };
    comp.setFilterValue();

    fixture.detectChanges();
    expect(comp.filterLabel$.value).toBe(name);
  }));

  it('should set filter value to the appliedFilter value when operator is authority and item is not found', waitForAsync(() => {
    const id = '1282121b-5394-4689-ab93-78d537764052';

    itemDataService.findById.and.returnValue(createFailedRemoteDataObject$());

    comp.appliedFilter = { filter: 'author', operator: 'authority', value: id, label: 'Odinson, Thor' };
    comp.setFilterValue();

    fixture.detectChanges();
    expect(comp.filterLabel$.value).toBe(id);
  }));

  it('should set filter value to the appliedFilter label when operator is not authority', () => {
    const label = 'Odinson, Thor';

    comp.appliedFilter = { filter: 'author', operator: 'equals', value: '1282121b-5394-4689-ab93-78d537764052', label };
    comp.setFilterValue();

    fixture.detectChanges();
    expect(comp.filterLabel$.value).toBe(label);
  });
});

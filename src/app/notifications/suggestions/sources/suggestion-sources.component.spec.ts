import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  provideRouter,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  buildPaginatedList,
  PaginatedList,
} from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { SuggestionSource } from '../../../core/notifications/suggestions/models/suggestion-source.model';
import { SuggestionSourceDataService } from '../../../core/notifications/suggestions/source/suggestion-source-data.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { TranslateLoaderMock } from '../../../shared/testing/translate-loader.mock';
import { SourceListComponent } from '../../shared/source-list.component';
import { SuggestionSourcesComponent } from './suggestion-sources.component';

describe('SuggestionSourcesComponent', () => {
  let component: SuggestionSourcesComponent;
  let fixture: ComponentFixture<SuggestionSourcesComponent>;
  let mockPaginationService: PaginationServiceStub;

  const mockSources: any[] = [
    { id: 'source1', total: 5 },
    { id: 'source2', total: 10 },
  ];
  const pageInfo = new PageInfo({
    elementsPerPage: 5,
    totalElements: 2,
    totalPages: 1,
    currentPage: 1,
  });
  const mockPaginatedList: PaginatedList<SuggestionSource> = buildPaginatedList(pageInfo, mockSources) ;
  const mockPaginatedListRD: Observable<RemoteData<PaginatedList<SuggestionSource>>> = createSuccessfulRemoteDataObject$(mockPaginatedList) ;
  const mockSuggestionSourceDataService: jasmine.SpyObj<SuggestionSourceDataService> = jasmine.createSpyObj('SuggestionSourceDataService', {
    'getSources': jasmine.createSpy('getSources'),
  });

  beforeEach(waitForAsync(() => {

    mockPaginationService = new PaginationServiceStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        SuggestionSourcesComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: SuggestionSourceDataService, useValue: mockSuggestionSourceDataService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).overrideComponent(SuggestionSourcesComponent, {
      remove: {
        imports: [
          AlertComponent,
          SourceListComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    // Mock the suggestion source data service to return an empty list
    mockSuggestionSourceDataService.getSources.and.returnValue(mockPaginatedListRD);
    console.log(mockSuggestionSourceDataService);
    fixture = TestBed.createComponent(SuggestionSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default pagination config', () => {
    expect(component.paginationConfig.pageSize).toBe(10);
    expect(component.paginationConfig.pageSizeOptions).toEqual([5, 10, 20, 40, 60]);
  });

  it('should load suggestion sources on init', () => {
    expect(mockSuggestionSourceDataService.getSources).toHaveBeenCalled();
    expect(component.sources$.value).toEqual(mockSources);
    expect(component.totalElements$.value).toBe(2);
  });

  it('should update loading status', () => {
    expect(component.loading$.value).toEqual(false);
  });

  it('should navigate to the specified source on select', () => {
    const router = TestBed.inject(Router);
    const route = TestBed.inject(ActivatedRoute);
    spyOn(router, 'navigate');

    const sourceId = 'test-source-id';
    component.onSelect(sourceId);

    expect(router.navigate).toHaveBeenCalledWith([sourceId], { relativeTo: route });
  });
});

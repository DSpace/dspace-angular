import { TestBed } from '@angular/core/testing';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { ProcessDataService } from '@dspace/core/data/processes/process-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Process } from '@dspace/core/processes/process.model';
import { ProcessStatus } from '@dspace/core/processes/process-status.model';
import { SearchFilter } from '@dspace/core/shared/search/models/search-filter.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { SearchService } from '../../shared/search/search.service';
import { ProcessOverviewService } from './process-overview.service';

describe('ProcessOverviewService', () => {
  let service: ProcessOverviewService;
  let processDataService: jasmine.SpyObj<ProcessDataService>;
  let searchService: jasmine.SpyObj<SearchService>;

  let process: Process;
  let paginationOptions: PaginationComponentOptions;

  beforeEach(() => {
    processDataService = jasmine.createSpyObj('ProcessDataService', [
      'searchBy',
      'stopAutoRefreshing',
    ]);

    searchService = jasmine.createSpyObj('SearchService', [
      'search',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProcessOverviewService,
        {
          provide: ProcessDataService,
          useValue: processDataService,
        },
        {
          provide: SearchService,
          useValue: searchService,
        },
      ],
    });

    service = TestBed.inject(ProcessOverviewService);

    process = Object.assign(new Process(), {
      processId: 1,
      scriptName: 'index-discovery',
      processStatus: ProcessStatus.COMPLETED,
    });

    paginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'completed-processes',
      currentPage: 1,
      pageSize: 5,
    });
  });

  describe('getProcessesBySearch', () => {
    it('should search Discovery using the processes configuration, generic query and process status filter', () => {
      const searchObjects = Object.assign(new SearchObjects<Process>(), {
        page: [
          Object.assign(new SearchResult<Process>(), {
            indexableObject: process,
          }),
        ],
      });

      searchService.search.and.returnValue(
        of(createSuccessfulRemoteDataObject(searchObjects)),
      );

      service.getProcessesBySearch(
        ProcessStatus.COMPLETED,
        'index-discovery',
        paginationOptions,
      ).subscribe();

      const options = searchService.search.calls.mostRecent().args[0];

      expect(options.configuration).toBe('processes');
      expect(options.query).toBe('index-discovery');
      expect(options.pagination).toBe(paginationOptions);
      expect(options.filters).toEqual([
        new SearchFilter(
          'f.process_status',
          [ProcessStatus.COMPLETED],
          'equals',
        ),
      ]);
    });

    it('should map Discovery search results to a paginated list of processes', (done: DoneFn) => {
      const searchObjects = Object.assign(new SearchObjects<Process>(), {
        page: [
          Object.assign(new SearchResult<Process>(), {
            indexableObject: process,
          }),
        ],
      });

      searchService.search.and.returnValue(
        of(createSuccessfulRemoteDataObject(searchObjects)),
      );

      service.getProcessesBySearch(
        ProcessStatus.COMPLETED,
        'index-discovery',
        paginationOptions,
      ).subscribe((rd: RemoteData<PaginatedList<Process>>) => {
        expect(rd.payload.page).toEqual([process]);
        done();
      });
    });
  });
});

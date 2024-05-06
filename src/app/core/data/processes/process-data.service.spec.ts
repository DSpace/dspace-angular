/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReducerManager } from '@ngrx/store';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { Process } from '../../../process-page/processes/process.model';
import { ProcessStatus } from '../../../process-page/processes/process-status.model';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { testDeleteDataImplementation } from '../base/delete-data.spec';
import { testFindAllDataImplementation } from '../base/find-all-data.spec';
import { testSearchDataImplementation } from '../base/search-data.spec';
import { BitstreamFormatDataService } from '../bitstream-format-data.service';
import { DSOChangeAnalyzer } from '../dso-change-analyzer.service';
import { FindListOptions } from '../find-list-options.model';
import { PaginatedList } from '../paginated-list.model';
import { RemoteData } from '../remote-data';
import { RequestService } from '../request.service';
import { RequestEntryState } from '../request-entry-state.model';
import {
  ProcessDataService,
  TIMER_FACTORY,
} from './process-data.service';

describe('ProcessDataService', () => {
  let testScheduler;

  const mockTimer = (fn: () => any, interval: number) => {
    fn();
    return 555;
  };

  describe('composition', () => {
    const initService = () => new ProcessDataService(null, null, null, null, null, null, null, null);
    testFindAllDataImplementation(initService);
    testDeleteDataImplementation(initService);
    testSearchDataImplementation(initService);
  });

  let requestService = getMockRequestService();
  let processDataService;
  let remoteDataBuildService;

  describe('autoRefreshUntilCompletion', () => {
    beforeEach(waitForAsync(() => {
      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          ProcessDataService,
          { provide: RequestService, useValue: null },
          { provide: RemoteDataBuildService, useValue: null },
          { provide: ObjectCacheService, useValue: null },
          { provide: ReducerManager, useValue: null },
          { provide: HALEndpointService, useValue: null },
          { provide: DSOChangeAnalyzer, useValue: null },
          { provide: BitstreamFormatDataService, useValue: null },
          { provide: NotificationsService, useValue: null },
          { provide: TIMER_FACTORY, useValue: mockTimer },
        ],
      });

      processDataService = TestBed.inject(ProcessDataService);
      spyOn(processDataService, 'invalidateByHref');
    }));

    it('should not do any polling when the process is already completed', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        let completedProcess = new Process();
        completedProcess.processStatus = ProcessStatus.COMPLETED;

        const completedProcessRD = new RemoteData(0, 0, 0, RequestEntryState.Success, null, completedProcess);

        spyOn(processDataService, 'findById').and.returnValue(
          cold('c', {
            'c': completedProcessRD,
          }),
        );

        let process$ = processDataService.autoRefreshUntilCompletion('instantly');
        expectObservable(process$).toBe('c', {
          c: completedProcessRD,
        });
      });

      expect(processDataService.findById).toHaveBeenCalledTimes(1);
      expect(processDataService.invalidateByHref).not.toHaveBeenCalled();
    });

    it('should poll until a process completes', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const runningProcess = Object.assign(new Process(), {
          _links: {
            self: {
              href: 'https://rest.api/processes/123',
            },
          },
        });
        runningProcess.processStatus = ProcessStatus.RUNNING;
        const completedProcess = new Process();
        completedProcess.processStatus = ProcessStatus.COMPLETED;
        const runningProcessRD = new RemoteData(0, 0, 0, RequestEntryState.Success, null, runningProcess);
        const completedProcessRD = new RemoteData(0, 0, 0, RequestEntryState.Success, null, completedProcess);

        spyOn(processDataService, 'findById').and.returnValue(
          cold('r 150ms c', {
            'r': runningProcessRD,
            'c': completedProcessRD,
          }),
        );

        let process$ = processDataService.autoRefreshUntilCompletion('foo', 100);
        expectObservable(process$).toBe('r 150ms c', {
          'r': runningProcessRD,
          'c': completedProcessRD,
        });
      });

      expect(processDataService.findById).toHaveBeenCalledTimes(1);
      expect(processDataService.invalidateByHref).toHaveBeenCalledTimes(1);
    });
  });

  describe('autoRefreshingSearchBy', () => {
    beforeEach(waitForAsync(() => {

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          ProcessDataService,
          { provide: RequestService, useValue: requestService },
          { provide: RemoteDataBuildService, useValue: null },
          { provide: ObjectCacheService, useValue: null },
          { provide: ReducerManager, useValue: null },
          { provide: HALEndpointService, useValue: null },
          { provide: DSOChangeAnalyzer, useValue: null },
          { provide: BitstreamFormatDataService, useValue: null },
          { provide: NotificationsService, useValue: null },
          { provide: TIMER_FACTORY, useValue: mockTimer },
        ],
      });

      processDataService = TestBed.inject(ProcessDataService);
    }));

    it('should refresh after the specified interval', fakeAsync(() => {
      const runningProcess = Object.assign(new Process(), {
        _links: {
          self: {
            href: 'https://rest.api/processes/123',
          },
        },
      });
      runningProcess.processStatus = ProcessStatus.RUNNING;

      const runningProcessPagination: PaginatedList<Process> = Object.assign(new PaginatedList(), {
        page: [runningProcess],
        _links: {
          self: {
            href: 'https://rest.api/processesList/456',
          },
        },
      });

      const runningProcessRD = new RemoteData(0, 0, 0, RequestEntryState.Success, null, runningProcessPagination);

      spyOn(processDataService, 'searchBy').and.returnValue(
        of(runningProcessRD),
      );

      expect(processDataService.searchBy).toHaveBeenCalledTimes(0);
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledTimes(0);

      let sub = processDataService.autoRefreshingSearchBy('id', 'byProperty', new FindListOptions(), 200).subscribe();
      expect(processDataService.searchBy).toHaveBeenCalledTimes(1);

      tick(250);

      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledTimes(1);

      sub.unsubscribe();
    }));
  });
});

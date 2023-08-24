/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { testFindAllDataImplementation } from '../base/find-all-data.spec';
import { ProcessDataService } from './process-data.service';
import { testDeleteDataImplementation } from '../base/delete-data.spec';
import { cold } from 'jasmine-marbles';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { RequestService } from '../request.service';
import { RemoteData } from '../remote-data';
import { RequestEntryState } from '../request-entry-state.model';
import { Process } from '../../../process-page/processes/process.model';
import { ProcessStatus } from '../../../process-page/processes/process-status.model';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { ReducerManager } from '@ngrx/store';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from '../dso-change-analyzer.service';
import { BitstreamFormatDataService } from '../bitstream-format-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

describe('ProcessDataService', () => {
  describe('composition', () => {
    const initService = () => new ProcessDataService(null, null, null, null, null, null, null);
    testFindAllDataImplementation(initService);
    testDeleteDataImplementation(initService);
  });

  let requestService;
  let processDataService;
  let remoteDataBuildService;

  describe('notifyOnCompletion', () => {
    beforeEach(waitForAsync(() => {
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
        ]
      });

      processDataService = TestBed.inject(ProcessDataService);
      spyOn(processDataService, 'invalidateByHref');
    }));

    it('TODO', () => {
      let completedProcess = new Process();
      completedProcess.processStatus = ProcessStatus.COMPLETED;

      spyOn(processDataService, 'findById').and.returnValue(
        cold('(c|)', {
          'c': new RemoteData(0, 0, 0, RequestEntryState.Success, null, completedProcess)
        })
      );

      let process$ = processDataService.notifyOnCompletion('instantly');
      process$.subscribe((rd) => {
        expect(processDataService.findById).toHaveBeenCalledTimes(1);
        expect(processDataService.invalidateByHref).not.toHaveBeenCalled();
      });
      expect(process$).toBeObservable(cold('(c|)', {
        'c': new RemoteData(0, 0, 0, RequestEntryState.Success, null, completedProcess)
      }));
    });

    it('TODO2', () => {
      let runningProcess = new Process();
      runningProcess.processStatus = ProcessStatus.RUNNING;
      let completedProcess = new Process();
      completedProcess.processStatus = ProcessStatus.COMPLETED;

      spyOn(processDataService, 'findById').and.returnValue(
        cold('p 150ms (c|)', {
          'p': new RemoteData(0, 0, 0, RequestEntryState.Success, null, runningProcess),
          'c': new RemoteData(0, 0, 0, RequestEntryState.Success, null, completedProcess)
        })
      );

      let process$ = processDataService.notifyOnCompletion('foo', 100);
      // expect(process$).toBeObservable(cold('- 800ms (c|)', {
      //   'c': new RemoteData(0, 0, 0, RequestEntryState.Success, null, completedProcess)
      // }));
      process$.subscribe((rd) => {
        expect(processDataService.findById).toHaveBeenCalledTimes(1);
        expect(processDataService.invalidateByHref).toHaveBeenCalledTimes(1);
      });
    });
  });

});

// /**
//  * Tests whether calls to `FindAllData` methods are correctly patched through in a concrete data service that implements it
//  */
// export function testFindAllDataImplementation(serviceFactory: () => FindAllData<any>) {
//   let service;
//
//   describe('FindAllData implementation', () => {
//     const OPTIONS = Object.assign(new FindListOptions(), { elementsPerPage: 10, currentPage: 3 });
//     const FOLLOWLINKS = [
//       followLink('test'),
//       followLink('something'),
//     ];
//
//     beforeAll(() => {
//       service = serviceFactory();
//       (service as any).findAllData =  jasmine.createSpyObj('findAllData', {
//         findAll: 'TEST findAll',
//       });
//     });
//
//     it('should handle calls to findAll', () => {
//       const out: any = service.findAll(OPTIONS, false, true, ...FOLLOWLINKS);
//
//       expect((service as any).findAllData.findAll).toHaveBeenCalledWith(OPTIONS, false, true, ...FOLLOWLINKS);
//       expect(out).toBe('TEST findAll');
//     });
//   });
// }

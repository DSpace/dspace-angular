import { Injectable } from '@angular/core';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Process } from '../processes/process.model';
import { RequestParam } from '../../core/cache/models/request-param.model';
import { ProcessStatus } from '../processes/process-status.model';
import { DatePipe } from '@angular/common';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';

/**
 * Service to manage the processes displayed in the
 * {@Link ProcessOverviewComponent} and the {@Link ProcessOverviewTableComponent}
 */
@Injectable({
  providedIn: 'root',
})
export class ProcessOverviewService {

  constructor(protected processDataService: ProcessDataService) {
  }

  /**
   * Date format to use for start and end time of processes
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  datePipe = new DatePipe('en-US');


  timeCreated = (process: Process) => this.datePipe.transform(process.creationTime, this.dateFormat, 'UTC');
  timeCompleted = (process: Process) => this.datePipe.transform(process.endTime, this.dateFormat, 'UTC');
  timeStarted = (process: Process) => this.datePipe.transform(process.startTime, this.dateFormat, 'UTC');

  /**
   * Retrieve processes by their status
   * @param processStatus              The status for which to retrieve processes
   * @param findListOptions            The FindListOptions object
   * @param autoRefreshingIntervalInMs Optional: The interval by which to automatically refresh the retrieved processes.
   * Leave empty or set to null to only retrieve the processes once.
   */
  getProcessesByProcessStatus(processStatus: ProcessStatus, findListOptions?: FindListOptions, autoRefreshingIntervalInMs: number = null): Observable<RemoteData<PaginatedList<Process>>> {
    let requestParam = new RequestParam('processStatus', processStatus);
    let options: FindListOptions = Object.assign(new FindListOptions(), {
      searchParams: [requestParam],
      elementsPerPage: 5,
    }, findListOptions);

    if (autoRefreshingIntervalInMs !== null && autoRefreshingIntervalInMs > 0) {
      return this.processDataService.autoRefreshingSearchBy('byProperty', options, autoRefreshingIntervalInMs);
    } else {
      return this.processDataService.searchBy('byProperty', options);
    }
  }

  /**
   * Map the provided paginationOptions to FindListOptions
   * @param paginationOptions the PaginationComponentOptions to map
   */
  getFindListOptions(paginationOptions: PaginationComponentOptions): FindListOptions {
    return Object.assign(
      new FindListOptions(),
      {
        currentPage: paginationOptions.currentPage,
        elementsPerPage: paginationOptions.pageSize,
      }
    );
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ProcessStatus } from '../../processes/process-status.model';
import { Observable, mergeMap, from as observableFrom } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Process } from '../../processes/process.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { ProcessOverviewService } from '../process-overview.service';
import { ProcessBulkDeleteService } from '../process-bulk-delete.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { map, switchMap, toArray } from 'rxjs/operators';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { redirectOn4xx } from '../../../core/shared/authorized.operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

/**
 * An interface to store a process and extra information related to the process
 * that is displayed in the overview table.
 */
export interface ProcessOverviewTableEntry {
  process: Process,
  user: string,
  info: string,
}

@Component({
  selector: 'ds-process-overview-table',
  templateUrl: './process-overview-table.component.html'
})
export class ProcessOverviewTableComponent implements OnInit {

  /**
   * The status of the processes this sections should show
   */
  @Input() processStatus: ProcessStatus;

  /**
   * Whether to use auto refresh for the processes shown in this table.
   */
  @Input() useAutoRefreshingSearchBy = false;

  /**
   * The interval by which to refresh if autoRefreshing is enabled
   */
  @Input() autoRefreshInterval = 5000;

  /**
   * The function used to retrieve the value that will be shown in the 'info' column of the table.
   * {@Link ProcessOverviewService} contains some predefined functions.
   */
  @Input() getInfoValueMethod: (process: Process) => string;

  /**
   * List of processes and their info to be shown in this table
   */
  processesRD$: Observable<RemoteData<PaginatedList<ProcessOverviewTableEntry>>>;

  /**
   * The pagination ID for this overview section
   */
  paginationId: string;

  /**
   * The current pagination options for the overview section
   */
  paginationOptions$: Observable<PaginationComponentOptions>;

  constructor(protected processOverviewService: ProcessOverviewService,
              protected processBulkDeleteService: ProcessBulkDeleteService,
              protected ePersonDataService: EPersonDataService,
              protected dsoNameService: DSONameService,
              protected paginationService: PaginationService,
              protected router: Router,
              protected auth: AuthService,
              ) {
  }

  ngOnInit() {
    // Creates an ID from the first 2 characters of the process status.
    // Should two process status values ever start with the same substring,
    // increase the number of characters until the ids are distinct.
    this.paginationId = this.processStatus.toLowerCase().substring(0,2);

    let defaultPaginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: this.paginationId,
      pageSize: 5,
    });

    // Get the current pagination from the route
    this.paginationOptions$ = this.paginationService.getCurrentPagination(this.paginationId, defaultPaginationOptions);

    // Once we have the pagination, retrieve the processes matching the process type and the pagination
    //
    // Reasoning why this monstrosity is the way it is:
    // To avoid having to recalculate the names of the submitters every time the page reloads, these have to be
    // retrieved beforehand and stored with the process. This is where the ProcessOverviewTableEntry interface comes in.
    // By storing the process together with the submitters name and the additional information to be shown in the table,
    // the template can be as dumb as possible. As the retrieval of the name also is done through an observable, this
    // complicates the construction of the data a bit though.
    // The reason why we store these as RemoteData<PaginatedList<ProcessOverviewTableEntry>> and not simply as
    // ProcessOverviewTableEntry[] is as follows:
    // When storing the PaginatedList<Process> and ProcessOverviewTableEntry[] separately, there is a small delay
    // between the update of the paginatedList and the entryArray. This results in the processOverviewPage showing
    // no processes for a split second every time the processes are updated which in turn causes the different
    // sections of the page to jump around. By combining these and causing the page to update only once this is avoided.
    this.processesRD$ = this.paginationOptions$
      .pipe(
        // Map the paginationOptions to findListOptions
        map((paginationOptions: PaginationComponentOptions) =>
          this.processOverviewService.getFindListOptions(paginationOptions)),
        // Use the findListOptions to retrieve the relevant processes every interval
        switchMap((findListOptions: FindListOptions) =>
          this.processOverviewService.getProcessesByProcessStatus(
            this.processStatus, findListOptions, this.useAutoRefreshingSearchBy ? this.autoRefreshInterval : null)
        ),
        // Redirect the user when he is logged out
        redirectOn4xx(this.router, this.auth),
        // Map RemoteData<PaginatedList<Process>> to RemoteData<PaginatedList<ProcessOverviewTableEntry>>
        switchMap((processesRD: RemoteData<PaginatedList<Process>>) => {
          // Create observable emitting all processes one by one
          return  observableFrom(processesRD.payload.page).pipe(
            // Map every Process to ProcessOverviewTableEntry
            mergeMap((process: Process) => {
              return this.getEPersonName(process.userId).pipe(
                map((name) => {
                  return {
                    process: process,
                    user: name,
                    info: this.getInfoValueMethod(process),
                  };
                }),
              );
            }),
            // Collect processOverviewTableEntries into array
            toArray(),
            // Create RemoteData<PaginatedList<ProcessOverviewTableEntry>>
            map((entries: ProcessOverviewTableEntry[]) => {
              const entriesPL: PaginatedList<ProcessOverviewTableEntry> =
                Object.assign(new PaginatedList(), processesRD.payload, { page: entries });
              const entriesRD: RemoteData<PaginatedList<ProcessOverviewTableEntry>> =
                Object.assign({}, processesRD, { payload: entriesPL });
              return entriesRD;
            }),
          );
        }),

      );

  }

  /**
   * Get the name of an EPerson by ID
   * @param id  ID of the EPerson
   */
  getEPersonName(id: string): Observable<string> {
    return this.ePersonDataService.findById(id).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((eperson: EPerson) => this.dsoNameService.getName(eperson)),
    );
  }

}

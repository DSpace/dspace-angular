import {
  AsyncPipe,
  isPlatformBrowser,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  from as observableFrom,
  mergeMap,
  Observable,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  toArray,
} from 'rxjs/operators';
import { PaginationService } from 'src/app/core/pagination/pagination.service';

import { AuthService } from '../../../core/auth/auth.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { RouteService } from '../../../core/services/route.service';
import { redirectOn4xx } from '../../../core/shared/authorized.operators';
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
} from '../../../core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../../../shared/utils/var.directive';
import { Process } from '../../processes/process.model';
import { ProcessStatus } from '../../processes/process-status.model';
import { ProcessBulkDeleteService } from '../process-bulk-delete.service';
import {
  ProcessOverviewService,
  ProcessSortField,
} from '../process-overview.service';

const NEW_PROCESS_PARAM = 'new_process_id';

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
  styleUrls: ['./process-overview-table.component.scss'],
  templateUrl: './process-overview-table.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgbCollapseModule,
    AsyncPipe,
    TranslateModule,
    PaginationComponent,
    RouterLink,
    NgForOf,
    NgIf,
    ThemedLoadingComponent,
    VarDirective,
  ],
})
export class ProcessOverviewTableComponent implements OnInit, OnDestroy {

  /**
   * The status of the processes this sections should show
   */
  @Input() processStatus: ProcessStatus;

  /**
   * The field on which the processes in this table are sorted
   * {@link ProcessSortField.creationTime} by default as every single process has a creation time,
   * but not every process has a start or end time
   */
  @Input() sortField: ProcessSortField = ProcessSortField.creationTime;

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
  processesRD$: BehaviorSubject<RemoteData<PaginatedList<ProcessOverviewTableEntry>>>;

  /**
   * The pagination ID for this overview section
   */
  paginationId: string;

  /**
   * The current pagination options for the overview section
   */
  paginationOptions$: Observable<PaginationComponentOptions>;

  /**
   * Whether the table is collapsed
   */
  isCollapsed = false;

  /**
   * The id of the process to highlight
   */
  newProcessId: string;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(protected processOverviewService: ProcessOverviewService,
              protected processBulkDeleteService: ProcessBulkDeleteService,
              public ePersonDataService: EPersonDataService,
              public dsoNameService: DSONameService,
              protected paginationService: PaginationService,
              protected routeService: RouteService,
              protected router: Router,
              protected auth: AuthService,
              private translateService: TranslateService,
              @Inject(PLATFORM_ID) protected platformId: object,
  ) {
  }

  ngOnInit() {
    // Only auto refresh on browsers
    if (!isPlatformBrowser(this.platformId)) {
      this.useAutoRefreshingSearchBy = false;
    }

    this.routeService.getQueryParameterValue(NEW_PROCESS_PARAM).pipe(take(1)).subscribe((id) => {
      this.newProcessId = id;
    });

    // Creates an ID from the first 2 characters of the process status.
    // Should two process status values ever start with the same substring,
    // increase the number of characters until the ids are distinct.
    this.paginationId = this.processStatus.toLowerCase().substring(0, 2);

    const defaultPaginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: this.paginationId,
      pageSize: 5,
    });

    // Get the current pagination from the route
    this.paginationOptions$ = this.paginationService.getCurrentPagination(this.paginationId, defaultPaginationOptions);

    this.processesRD$ = new BehaviorSubject(undefined);

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
    this.subs.push(this.paginationOptions$
      .pipe(
        // Map the paginationOptions to findListOptions
        map((paginationOptions: PaginationComponentOptions) =>
          this.processOverviewService.getFindListOptions(paginationOptions, this.sortField)),
        // Use the findListOptions to retrieve the relevant processes every interval
        switchMap((findListOptions: FindListOptions) =>
          this.processOverviewService.getProcessesByProcessStatus(
            this.processStatus, findListOptions, this.useAutoRefreshingSearchBy ? this.autoRefreshInterval : null),
        ),
        // Redirect the user when he is logged out
        redirectOn4xx(this.router, this.auth),
        getAllCompletedRemoteData(),
        // Map RemoteData<PaginatedList<Process>> to RemoteData<PaginatedList<ProcessOverviewTableEntry>>
        switchMap((processesRD: RemoteData<PaginatedList<Process>>) => {
          // Create observable emitting all processes one by one
          return observableFrom(processesRD.payload.page).pipe(
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
      ).subscribe((next: RemoteData<PaginatedList<ProcessOverviewTableEntry>>) => {
        this.processesRD$.next(next);
      }));

    // Collapse this section when the number of processes is zero the first time processes are retrieved
    this.subs.push(this.processesRD$.pipe(
      filter((processListRd: RemoteData<PaginatedList<ProcessOverviewTableEntry>>) => hasValue(processListRd)),
      take(1),
    ).subscribe(
      (processesRD: RemoteData<PaginatedList<ProcessOverviewTableEntry>>) => {
        if (!(processesRD.payload.totalElements > 0)) {
          this.isCollapsed = true;
        }
      },
    ));

  }

  /**
   * Get the name of an EPerson by ID
   * @param id  ID of the EPerson
   */
  getEPersonName(id: string): Observable<string> {
    if (isNotEmpty(id)) {
      return this.ePersonDataService.findById(id).pipe(
        getFirstCompletedRemoteData(),
        switchMap((rd: RemoteData<EPerson>) => {
          if (rd.hasSucceeded) {
            return [this.dsoNameService.getName(rd.payload)];
          } else {
            return this.translateService.get('process.overview.unknown.user');
          }
        }),
      );
    } else {
      return this.translateService.get('process.overview.unknown.user');
    }
  }

  /**
   * Get the css class for a row depending on the state of the process
   * @param process
   */
  getRowClass(process: Process): string {
    if (this.processBulkDeleteService.isToBeDeleted(process.processId)) {
      return 'table-danger';
    } else if (this.newProcessId === process.processId) {
      return 'table-info';
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
    this.processOverviewService.stopAutoRefreshing(this.processStatus);
  }

}

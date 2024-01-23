import { Component, Input, OnInit } from '@angular/core';
import { ProcessStatus } from '../../processes/process-status.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Process } from '../../processes/process.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { ProcessOverviewService } from '../process-overview.service';
import { ProcessBulkDeleteService } from '../process-bulk-delete.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { map, switchMap } from 'rxjs/operators';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { redirectOn4xx } from '../../../core/shared/authorized.operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

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
   * List of processes to be shown in this table
   */
  processesRD$: Observable<RemoteData<PaginatedList<Process>>>;

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
    this.paginationId = 'processOverviewTable' + this.processStatus;

    let defaultPaginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: this.paginationId,
      pageSize: 5,
    });

    this.paginationOptions$ = this.paginationService.getCurrentPagination(this.paginationId, defaultPaginationOptions);
    this.processesRD$ = this.paginationOptions$
      .pipe(
        map((paginationOptions: PaginationComponentOptions) =>
          this.processOverviewService.getFindListOptions(paginationOptions)),
        switchMap((findListOptions: FindListOptions) =>
          this.processOverviewService.getProcessesByProcessStatus(
            this.processStatus, findListOptions, this.useAutoRefreshingSearchBy ? this.autoRefreshInterval : null)
        ),
        redirectOn4xx(this.router, this.auth),
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

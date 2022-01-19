import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Process } from '../processes/process.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { map, switchMap, take } from 'rxjs/operators';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-process-overview',
  templateUrl: './process-overview.component.html',
})
/**
 * Component displaying a list of all processes in a paginated table
 */
export class ProcessOverviewComponent implements OnInit {

  /**
   * List of all processes
   */
  processesRD$: BehaviorSubject<RemoteData<PaginatedList<Process>>> = new BehaviorSubject(null);

  /**
   * The current pagination configuration for the page used by the FindAll method
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20
  });

  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'po',
    pageSize: 20
  });

  /**
   * Date format to use for start and end time of processes
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected processService: ProcessDataService,
              protected paginationService: PaginationService,
              protected ePersonService: EPersonDataService,
              protected authorizationService: AuthorizationDataService,
              protected notificationService: NotificationsService,
              protected translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.setProcesses();
  }

  /**
   * Send a request to fetch all processes for the current page
   */
  setProcesses() {
    const pageConfig$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config);
    const isAdmin$ = this.isCurrentUserAdmin();
    combineLatest([
      isAdmin$,
      pageConfig$
    ]).pipe(
      switchMap(([isAdmin, config]) => {
        if (isAdmin) {
          return this.processService.findAll(config);
        } else {
          return this.processService.searchBy('own', config);
        }
      }),
      getFirstCompletedRemoteData(),
      take(1),
    ).subscribe(remoteData => {
      this.processesRD$.next(remoteData);
    });
  }

  onPaginationChange() {
    this.processService.setStale();
    this.setProcesses();
  }

  isCurrentUserAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, undefined, undefined);
  }

  isProcessCompleted(process: Process): boolean {
    return process.processStatus?.toString() === 'COMPLETED' || process.processStatus?.toString() === 'FAILED';
  }

  /**
   * Get the name of an EPerson by ID
   * @param id  ID of the EPerson
   */
  getEpersonName(id: string): Observable<string> {
    return this.ePersonService.findById(id).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((eperson: EPerson) => eperson.name)
    );
  }

  delete(process: Process) {
    this.processService.setStale();
    this.processService.delete(process.processId).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((remoteData => {
      if (remoteData.isSuccess) {
        this.notificationService.success(this.translateService.get('process.overview.delete.success'));
        this.setProcesses();
      } else {
        this.notificationService.error(this.translateService.get('process.overview.delete.failed'));
      }
    }));
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.pageConfig.id);
  }

}

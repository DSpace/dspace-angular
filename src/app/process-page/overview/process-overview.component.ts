import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Process } from '../processes/process.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { switchMap, take } from 'rxjs/operators';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { ProcessBulkDeleteService } from './process-bulk-delete.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-process-overview',
  templateUrl: './process-overview.component.html',
})
/**
 * Component displaying a list of all processes in a paginated table
 */
export class ProcessOverviewComponent implements OnInit, OnDestroy {

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

  processesToDelete: string[] = [];
  private modalRef: any;

  isProcessingSub: Subscription;

  constructor(protected processService: ProcessDataService,
              protected paginationService: PaginationService,
              protected ePersonService: EPersonDataService,
              protected modalService: NgbModal,
              public processBulkDeleteService: ProcessBulkDeleteService,
              protected dsoNameService: DSONameService,
              private translateService: TranslateService,
              protected authorizationService: AuthorizationDataService,
              protected notificationService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.setProcesses();
    this.processBulkDeleteService.clearAllProcesses();
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
          return this.processService.findAll(config, false, true);
        } else {
          return this.processService.searchItsOwnProcesses(config, false, true);
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
    if (isNotEmpty(id)) {
      return this.ePersonService.findById(id).pipe(
        getFirstCompletedRemoteData(),
        switchMap((rd: RemoteData<EPerson>) => {
          if (rd.hasSucceeded) {
            return [this.dsoNameService.getName(rd.payload)];
          } else {
            return this.translateService.get('process.overview.unknown.user');
          }
        })
      );
    } else {
      return this.translateService.get('process.overview.unknown.user');
    }
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
    if (hasValue(this.isProcessingSub)) {
      this.isProcessingSub.unsubscribe();
    }
  }

  /**
   * Open a given modal.
   * @param content   - the modal content.
   */
  openDeleteModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Close the modal.
   */
  closeModal() {
    this.modalRef.close();
  }

  /**
   * Delete the previously selected processes using the processBulkDeleteService
   * After the deletion has started, subscribe to the isProcessing$ and when it is set
   * to false after the processing is done, close the modal and reinitialise the processes
   */
  deleteSelected() {
    this.processBulkDeleteService.deleteSelectedProcesses();

    if (hasValue(this.isProcessingSub)) {
      this.isProcessingSub.unsubscribe();
    }
    this.isProcessingSub = this.processBulkDeleteService.isProcessing$()
      .subscribe((isProcessing) => {
      if (!isProcessing) {
        this.closeModal();
        this.setProcesses();
      }
    });
  }
}

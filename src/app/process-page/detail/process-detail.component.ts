import {
  AsyncPipe,
  DatePipe,
  isPlatformBrowser,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  filter,
  finalize,
  find,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { AlertType } from '../../shared/alert/alert-type';
import { hasValue } from '../../shared/empty.util';
import { ThemedFileDownloadLinkComponent } from '../../shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { HasNoValuePipe } from '../../shared/utils/has-no-value.pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { PROCESS_PAGE_FOLLOW_LINKS } from '../process-page.resolver';
import { getProcessListRoute } from '../process-page-routing.paths';
import { Process } from '../processes/process.model';
import { ProcessStatus } from '../processes/process-status.model';
import { ProcessDetailFieldComponent } from './process-detail-field/process-detail-field.component';

@Component({
  selector: 'ds-process-detail',
  templateUrl: './process-detail.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FileSizePipe,
    HasNoValuePipe,
    ProcessDetailFieldComponent,
    RouterLink,
    ThemedFileDownloadLinkComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
/**
 * A component displaying detailed information about a DSpace Process
 */
export class ProcessDetailComponent implements OnInit, OnDestroy {

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * The Process's Remote Data
   */
  processRD$: Observable<RemoteData<Process>>;

  /**
   * The Process's Output Files
   */
  filesRD$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  /**
   * File link that contain the output logs with auth token
   */
  outputLogFileUrl$: Observable<string>;

  /**
   * The Process's Output logs
   */
  outputLogs$: BehaviorSubject<string> = new BehaviorSubject(undefined);

  /**
   * Boolean on whether or not to show the output logs
   */
  showOutputLogs = false;
  /**
   * When it's retrieving the output logs from backend, to show loading component
   */
  retrievingOutputLogs$ = new BehaviorSubject<boolean>(false);

  /**
   * Date format to use for start and end time of processes
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss ZZZZ';

  isRefreshing$: Observable<boolean>;

  isDeleting: boolean;

  protected autoRefreshingID: string;

  /**
   * Reference to NgbModal
   */
  protected modalRef: NgbModalRef;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: object,
    protected route: ActivatedRoute,
    protected router: Router,
    protected processService: ProcessDataService,
    protected bitstreamDataService: BitstreamDataService,
    protected nameService: DSONameService,
    private zone: NgZone,
    protected authService: AuthService,
    protected http: HttpClient,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
  ) {}

  /**
   * Initialize component properties
   * Display a 404 if the process doesn't exist
   */
  ngOnInit(): void {
    this.processRD$ = this.route.data.pipe(
      switchMap((data) => {
        if (isPlatformBrowser(this.platformId)) {
          this.autoRefreshingID = this.route.snapshot.params.id;
          return this.processService.autoRefreshUntilCompletion(this.autoRefreshingID, 5000, ...PROCESS_PAGE_FOLLOW_LINKS);
        } else {
          return [data.process as RemoteData<Process>];
        }
      }),
      filter(() => !this.isDeleting),
      redirectOn4xx(this.router, this.authService),
    );

    this.isRefreshing$ = this.processRD$.pipe(
      find((processRD: RemoteData<Process>) => ProcessDataService.hasCompletedOrFailed(processRD.payload)),
      map(() => false),
      startWith(true),
    );

    this.filesRD$ = this.processRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      switchMap((process: Process) => process.files),
    );
  }

  /**
   * Make sure the autoRefreshUntilCompletion is cleaned up properly
   */
  ngOnDestroy() {
    if (hasValue(this.autoRefreshingID)) {
      this.processService.stopAutoRefreshing(this.autoRefreshingID);
    }
  }

  /**
   * Get the name of a bitstream
   * @param bitstream
   */
  getFileName(bitstream: Bitstream) {
    return bitstream instanceof DSpaceObject ? this.nameService.getName(bitstream) : 'unknown';
  }

  /**
   * Retrieves the process logs, while setting the loading subject to true.
   * Sets the outputLogs when retrieved and sets the showOutputLogs boolean to show them and hide the button.
   */
  showProcessOutputLogs() {
    this.retrievingOutputLogs$.next(true);
    this.zone.runOutsideAngular(() => {
      const processOutputRD$: Observable<RemoteData<Bitstream>> = this.processRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((process: Process) => {
          return this.bitstreamDataService.findByHref(process._links.output.href, false);
        }),
      );
      this.outputLogFileUrl$ = processOutputRD$.pipe(
        getFirstSucceededRemoteData(),
        tap((processOutputFileRD: RemoteData<Bitstream>) => {
          if (processOutputFileRD.statusCode === 204) {
            this.zone.run(() => this.retrievingOutputLogs$.next(false));
            this.showOutputLogs = true;
          }
        }),
        switchMap((processOutput: RemoteData<Bitstream>) => {
          const url = processOutput.payload._links.content.href;
          return this.authService.getShortlivedToken().pipe(take(1),
            map((token: string) => {
              return hasValue(token) ? new URLCombiner(url, `?authentication-token=${token}`).toString() : url;
            }));
        }),
      );
    });
    this.outputLogFileUrl$.pipe(take(1),
      switchMap((url: string) => {
        return this.getTextFile(url);
      }),
      finalize(() => this.zone.run(() => this.retrievingOutputLogs$.next(false))),
    ).subscribe((logs: string) => {
      this.outputLogs$.next(logs);
    });
  }

  getTextFile(filename: string): Observable<string> {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.http.get(filename, { responseType: 'text' })
      .pipe(
        finalize(() => {
          this.showOutputLogs = true;
        }),
      );
  }

  /**
   * Whether or not the given process has Completed or Failed status
   * @param process Process to check if completed or failed
   */
  isProcessFinished(process: Process): boolean {
    return (hasValue(process) && hasValue(process.processStatus) &&
      (process.processStatus.toString() === ProcessStatus[ProcessStatus.COMPLETED].toString()
        || process.processStatus.toString() === ProcessStatus[ProcessStatus.FAILED].toString()));
  }

  /**
   * Delete the current process
   * @param process
   */
  deleteProcess(process: Process) {
    this.isDeleting = true;
    this.processService.delete(process.processId).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('process.detail.delete.success'));
        this.closeModal();
        void this.router.navigateByUrl(getProcessListRoute());
      } else {
        this.notificationsService.error(this.translateService.get('process.detail.delete.error'));
        this.isDeleting = false;
      }
    });
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
}

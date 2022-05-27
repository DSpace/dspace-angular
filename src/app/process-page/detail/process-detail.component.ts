import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteData
} from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { AlertType } from '../../shared/alert/aletr-type';
import { hasValue } from '../../shared/empty.util';
import { ProcessStatus } from '../processes/process-status.model';
import { Process } from '../processes/process.model';
import { redirectOn4xx } from '../../core/shared/authorized.operators';

@Component({
  selector: 'ds-process-detail',
  templateUrl: './process-detail.component.html',
})
/**
 * A component displaying detailed information about a DSpace Process
 */
export class ProcessDetailComponent implements OnInit {

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
  showOutputLogs;
  /**
   * When it's retrieving the output logs from backend, to show loading component
   */
  retrievingOutputLogs$: BehaviorSubject<boolean>;

  /**
   * Date format to use for start and end time of processes
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss ZZZZ';

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected processService: ProcessDataService,
              protected bitstreamDataService: BitstreamDataService,
              protected nameService: DSONameService,
              private zone: NgZone,
              protected authService: AuthService,
              protected http: HttpClient) {
  }

  /**
   * Initialize component properties
   * Display a 404 if the process doesn't exist
   */
  ngOnInit(): void {
    this.showOutputLogs = false;
    this.retrievingOutputLogs$ = new BehaviorSubject<boolean>(false);
    this.processRD$ = this.route.data.pipe(
      map((data) => {
        return data.process as RemoteData<Process>;
      }),
      redirectOn4xx(this.router, this.authService)
    );

    this.filesRD$ = this.processRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((process: Process) => this.processService.getFiles(process.processId))
    );
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
    console.log('showProcessOutputLogs');
    this.retrievingOutputLogs$.next(true);
    this.zone.runOutsideAngular(() => {
      const processOutputRD$: Observable<RemoteData<Bitstream>> = this.processRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((process: Process) => {
          return this.bitstreamDataService.findByHref(process._links.output.href, false);
        })
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
        })
      );
    });
     this.outputLogFileUrl$.pipe(take(1),
      switchMap((url: string) => {
        return this.getTextFile(url);
      }),
      finalize(() => this.zone.run(() => this.retrievingOutputLogs$.next(false)))
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

}

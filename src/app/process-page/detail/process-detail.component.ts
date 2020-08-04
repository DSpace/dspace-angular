import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ProcessOutputDataService } from '../../core/data/process-output-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ProcessOutput } from '../processes/process-output.model';
import { Process } from '../processes/process.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { getFirstSucceededRemoteDataPayload, redirectToPageNotFoundOn404 } from '../../core/shared/operators';
import { AlertType } from '../../shared/alert/aletr-type';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { Bitstream } from '../../core/shared/bitstream.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

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
   * The Process's Output logs
   */
  outputLogs$: Observable<string[]>;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected processService: ProcessDataService,
              protected processOutputService: ProcessOutputDataService,
              protected nameService: DSONameService) {
  }

  /**
   * Initialize component properties
   * Display a 404 if the process doesn't exist
   */
  ngOnInit(): void {
    this.processRD$ = this.route.data.pipe(
      map((data) => data.process as RemoteData<Process>),
      redirectToPageNotFoundOn404(this.router)
    );

    this.filesRD$ = this.processRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((process: Process) => this.processService.getFiles(process.processId))
    );

    const processOutputRD$: Observable<RemoteData<ProcessOutput>> = this.processRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((process: Process) => this.processOutputService.findByHref(process._links.output.href))
    );
    this.outputLogs$ = processOutputRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((processOutput: ProcessOutput) => {
        return [processOutput.logs];
      })
    )
  }

  /**
   * Get the name of a bitstream
   * @param bitstream
   */
  getFileName(bitstream: Bitstream) {
    return bitstream instanceof DSpaceObject ? this.nameService.getName(bitstream) : 'unknown';
  }

}

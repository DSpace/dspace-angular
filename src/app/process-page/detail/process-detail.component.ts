import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../processes/process.model';
import { map, switchMap } from 'rxjs/operators';
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

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected processService: ProcessDataService,
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
  }

  /**
   * Get the name of a bitstream
   * @param bitstream
   */
  getFileName(bitstream: Bitstream) {
    return this.nameService.getName(bitstream);
  }

}

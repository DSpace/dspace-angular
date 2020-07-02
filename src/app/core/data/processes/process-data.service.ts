import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { Process } from '../../../process-page/processes/process.model';
import { dataService } from '../../cache/builders/build-decorators';
import { PROCESS } from '../../../process-page/processes/process.resource-type';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import { ProcessFilesRequest, RestRequest } from '../request.models';
import { configureRequest, filterSuccessfulResponses } from '../../shared/operators';
import { GenericSuccessResponse } from '../../cache/response.models';
import { PaginatedList } from '../paginated-list';
import { Bitstream } from '../../shared/bitstream.model';
import { RemoteData } from '../remote-data';

@Injectable()
@dataService(PROCESS)
export class ProcessDataService extends DataService<Process> {
  protected linkPath = 'processes';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Process>) {
    super();
  }

  /**
   * Get the endpoint for a process his files
   * @param processId The ID of the process
   */
  getFilesEndpoint(processId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      switchMap((href) => this.halService.getEndpoint('files', `${href}/${processId}`))
    );
  }

  /**
   * Get a process his output files
   * @param processId The ID of the process
   */
  getFiles(processId: string): Observable<RemoteData<PaginatedList<Bitstream>>> {
    const request$ = this.getFilesEndpoint(processId).pipe(
      map((href) => new ProcessFilesRequest(this.requestService.generateRequestId(), href)),
      configureRequest(this.requestService)
    );
    const requestEntry$ = request$.pipe(
      switchMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );
    const payload$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: GenericSuccessResponse<PaginatedList<Bitstream>>) => response.payload)
    );

    return this.rdbService.toRemoteDataObservable(requestEntry$, payload$);
  }
}

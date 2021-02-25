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
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PaginatedList } from '../paginated-list.model';
import { Bitstream } from '../../shared/bitstream.model';
import { RemoteData } from '../remote-data';
import { BitstreamDataService } from '../bitstream-data.service';

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
    protected bitstreamDataService: BitstreamDataService,
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
   * Get a process' output files
   * @param processId The ID of the process
   */
  getFiles(processId: string): Observable<RemoteData<PaginatedList<Bitstream>>> {
    const href$ = this.getFilesEndpoint(processId);
    return this.bitstreamDataService.findAllByHref(href$);
  }
}

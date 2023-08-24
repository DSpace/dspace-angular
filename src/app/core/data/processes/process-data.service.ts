import { Injectable, NgZone } from '@angular/core';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { Process } from '../../../process-page/processes/process.model';
import { PROCESS } from '../../../process-page/processes/process.resource-type';
import { Observable } from 'rxjs';
import { switchMap, filter, take } from 'rxjs/operators';
import { PaginatedList } from '../paginated-list.model';
import { Bitstream } from '../../shared/bitstream.model';
import { RemoteData } from '../remote-data';
import { BitstreamDataService } from '../bitstream-data.service';
import { IdentifiableDataService } from '../base/identifiable-data.service';
import { FollowLinkConfig, followLink } from '../../../shared/utils/follow-link-config.model';
import { FindAllData, FindAllDataImpl } from '../base/find-all-data';
import { FindListOptions } from '../find-list-options.model';
import { dataService } from '../base/data-service.decorator';
import { DeleteData, DeleteDataImpl } from '../base/delete-data';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NoContent } from '../../shared/NoContent.model';
import { getAllCompletedRemoteData } from '../../shared/operators';
import { ProcessStatus } from 'src/app/process-page/processes/process-status.model';

@Injectable()
@dataService(PROCESS)
export class ProcessDataService extends IdentifiableDataService<Process> implements FindAllData<Process>, DeleteData<Process> {
  private findAllData: FindAllData<Process>;
  private deleteData: DeleteData<Process>;
  protected activelyBeingPolled: Set<string> = new Set();

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected zone: NgZone,
  ) {
    super('processes', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
  }

  /**
   * Get the endpoint for the files of the process
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
    return this.bitstreamDataService.findListByHref(href$);
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options                     Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>>}
   *    Return an observable that emits object list
   */
  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Process>[]): Observable<RemoteData<PaginatedList<Process>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Delete an existing object on the server
   * @param   objectId The id of the object to be removed
   * @param   copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
   *                            metadata should be saved as real metadata
   * @return  A RemoteData observable with an empty payload, but still representing the state of the request: statusCode,
   *          errorMessage, timeCompleted, etc
   */
  public delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  /**
   * Delete an existing object on the server
   * @param   href The self link of the object to be removed
   * @param   copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
   *                            metadata should be saved as real metadata
   * @return  A RemoteData observable with an empty payload, but still representing the state of the request: statusCode,
   *          errorMessage, timeCompleted, etc
   *          Only emits once all request related to the DSO has been invalidated.
   */
  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  // TODO
  public notifyOnCompletion(processId: string, pollingIntervalInMs = 5000): Observable<RemoteData<Process>> {
    const process$ = this.findById(processId, false, true, followLink('script'))
      .pipe(
        getAllCompletedRemoteData(),
      );

    // TODO: this is horrible
    const statusIs = (process: Process, status: ProcessStatus) =>
      process.processStatus === status;

    // If we have to wait too long for the result, we should mark the result as stale.
    // However, we should make sure this happens only once (in case there are multiple observers waiting
    // for the result).
    if (!this.activelyBeingPolled.has(processId)) {
      this.activelyBeingPolled.add(processId);

      // Create a subscription that marks the data as stale if the polling interval time has been exceeded.
      const sub = process$.subscribe((rd) => {
        const process = rd.payload;
        if (statusIs(process, ProcessStatus.COMPLETED) || statusIs(process, ProcessStatus.FAILED)) {
          this.activelyBeingPolled.delete(processId);
          sub.unsubscribe();
        } else {
          this.zone.runOutsideAngular(() =>
            setTimeout(() => {
              this.invalidateByHref(process._links.self.href);
            }, pollingIntervalInMs)
          );
        }
      });
    }

    return process$.pipe(
      filter(rd => statusIs(rd.payload, ProcessStatus.COMPLETED) || statusIs(rd.payload, ProcessStatus.FAILED)),
      take(1)
    );
  }
}

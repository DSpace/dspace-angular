import {
  Inject,
  Injectable,
  InjectionToken,
  NgZone,
} from '@angular/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  find,
  switchMap,
} from 'rxjs/operators';
import { ProcessStatus } from 'src/app/process-page/processes/process-status.model';

import { Process } from '../../../process-page/processes/process.model';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { Bitstream } from '../../shared/bitstream.model';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NoContent } from '../../shared/NoContent.model';
import { getAllCompletedRemoteData } from '../../shared/operators';
import {
  DeleteData,
  DeleteDataImpl,
} from '../base/delete-data';
import {
  FindAllData,
  FindAllDataImpl,
} from '../base/find-all-data';
import { IdentifiableDataService } from '../base/identifiable-data.service';
import {
  SearchData,
  SearchDataImpl,
} from '../base/search-data';
import { BitstreamDataService } from '../bitstream-data.service';
import { FindListOptions } from '../find-list-options.model';
import { PaginatedList } from '../paginated-list.model';
import { RemoteData } from '../remote-data';
import { RequestService } from '../request.service';

/**
 * Create an InjectionToken for the default JS setTimeout function, purely so we can mock it during
 * testing. (fakeAsync isn't working for this case)
 */
export const TIMER_FACTORY = new InjectionToken<(callback: (...args: any[]) => void, ms?: number, ...args: any[]) => NodeJS.Timeout>('timer', {
  providedIn: 'root',
  factory: () => setTimeout,
});

@Injectable({ providedIn: 'root' })
export class ProcessDataService extends IdentifiableDataService<Process> implements FindAllData<Process>, DeleteData<Process>, SearchData<Process> {
  private findAllData: FindAllData<Process>;
  private deleteData: DeleteData<Process>;
  private searchData: SearchData<Process>;
  protected activelyBeingPolled: Map<string, NodeJS.Timeout> = new Map();
  protected subs: Map<string, Subscription> = new Map();

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected zone: NgZone,
    @Inject(TIMER_FACTORY) protected timer: (callback: (...args: any[]) => void, ms?: number, ...args: any[]) => NodeJS.Timeout,
  ) {
    super('processes', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Return true if the given process has the given status
   * @protected
   */
  protected static statusIs(process: Process, status: ProcessStatus): boolean {
    return hasValue(process) && process.processStatus === status;
  }

  /**
   * Return true if the given process has the status COMPLETED or FAILED
   */
  public static hasCompletedOrFailed(process: Process): boolean {
    return ProcessDataService.statusIs(process, ProcessStatus.COMPLETED) ||
      ProcessDataService.statusIs(process, ProcessStatus.FAILED);
  }

  /**
   * Get the endpoint for the files of the process
   * @param processId The ID of the process
   */
  getFilesEndpoint(processId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      switchMap((href) => this.halService.getEndpoint('files', `${href}/${processId}`)),
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
   * @param searchMethod                The search method for the Process
   * @param options                     The FindListOptions object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true.
   * @param reRequestOnStale            Whether the request should automatically be re-
   *                                    requested after the response becomes stale.
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should automatically be resolved.
   * @return {Observable<RemoteData<PaginatedList<Process>>>}
   *    Return an observable that emits a paginated list of processes
   */
  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Process>[]): Observable<RemoteData<PaginatedList<Process>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * @param id                          The id for this auto-refreshing search. Used to stop
   *                                    auto-refreshing afterwards, and ensure we're not
   *                                    auto-refreshing the same thing multiple times.
   * @param searchMethod                The search method for the Process
   * @param options                     The FindListOptions object
   * @param pollingIntervalInMs         The interval by which the search will be repeated
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should automatically be resolved.
   * @return {Observable<RemoteData<PaginatedList<Process>>>}
   *    Return an observable that emits a paginated list of processes every interval
   */
  autoRefreshingSearchBy(id: string, searchMethod: string, options?: FindListOptions, pollingIntervalInMs: number = 5000, ...linksToFollow: FollowLinkConfig<Process>[]): Observable<RemoteData<PaginatedList<Process>>> {

    const result$ = this.searchBy(searchMethod, options, true, true, ...linksToFollow).pipe(
      getAllCompletedRemoteData(),
    );

    const sub = result$.pipe(
      filter(() =>
        !this.activelyBeingPolled.has(id),
      ),
    ).subscribe((processListRd: RemoteData<PaginatedList<Process>>) => {
      this.clearCurrentTimeout(id);
      const nextTimeout = this.timer(() => {
        this.activelyBeingPolled.delete(id);
        this.requestService.setStaleByHrefSubstring(processListRd.payload._links.self.href);
      }, pollingIntervalInMs);

      this.activelyBeingPolled.set(id, nextTimeout);
    });

    this.subs.set(id, sub);

    return result$;
  }

  /**
   * Stop auto-refreshing the request with the given id
   * @param id the id of the request to stop automatically refreshing
   */
  stopAutoRefreshing(id: string) {
    this.clearCurrentTimeout(id);
    if (hasValue(this.subs.get(id))) {
      this.subs.get(id).unsubscribe();
      this.subs.delete(id);
    }
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

  /**
   * Clear the timeout for the given id, if that timeout exists
   * @protected
   */
  protected clearCurrentTimeout(id: string): void {
    const timeout = this.activelyBeingPolled.get(id);
    if (hasValue(timeout)) {
      clearTimeout(timeout);
    }
    this.activelyBeingPolled.delete(id);
  }

  /**
   * Poll the process with the given ID, using the given interval, until that process either
   * completes successfully or fails
   *
   * Return an Observable<RemoteData> for the Process. Note that this will also emit while the
   * process is still running. It will only emit again when the process (not the RemoteData!) changes
   * status. That makes it more convenient to retrieve that process for a component: you can replace
   * a findByID call with this method, rather than having to do a separate findById, and then call
   * this method
   *
   * @param processId           The ID of the {@link Process} to poll
   * @param pollingIntervalInMs The interval for how often the request needs to be polled
   * @param linksToFollow       List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be
   *                            automatically resolved
   */
  public autoRefreshUntilCompletion(processId: string, pollingIntervalInMs = 5000, ...linksToFollow: FollowLinkConfig<Process>[]): Observable<RemoteData<Process>> {
    const process$: Observable<RemoteData<Process>> = this.findById(processId, true, true, ...linksToFollow)
      .pipe(
        getAllCompletedRemoteData(),
      );

    // Create a subscription that marks the data as stale if the process hasn't been completed and
    // the polling interval time has been exceeded.
    const sub = process$.pipe(
      filter((processRD: RemoteData<Process>) =>
        !ProcessDataService.hasCompletedOrFailed(processRD.payload) &&
        !this.activelyBeingPolled.has(processId),
      ),
    ).subscribe((processRD: RemoteData<Process>) => {
      this.clearCurrentTimeout(processId);
      if (processRD.hasSucceeded) {
        const nextTimeout = this.timer(() => {
          this.activelyBeingPolled.delete(processId);
          this.invalidateByHref(processRD.payload._links.self.href);
        }, pollingIntervalInMs);

        this.activelyBeingPolled.set(processId, nextTimeout);
      }
    });

    this.subs.set(processId, sub);

    // When the process completes create a one off subscription (the `find` completes the
    // observable) that unsubscribes the previous one, removes the processId from the list of
    // processes being polled and clears any running timeouts
    process$.pipe(
      find((processRD: RemoteData<Process>) => ProcessDataService.hasCompletedOrFailed(processRD.payload)),
    ).subscribe(() => {
      this.stopAutoRefreshing(processId);
    });

    return process$.pipe(
      distinctUntilChanged((previous: RemoteData<Process>, current: RemoteData<Process>) =>
        previous.payload?.processStatus === current.payload?.processStatus,
      ),
    );
  }
}

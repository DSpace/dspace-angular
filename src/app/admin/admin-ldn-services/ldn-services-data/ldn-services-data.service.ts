import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { RequestParam } from '../../../core/cache/models/request-param.model';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import {
  CreateData,
  CreateDataImpl,
} from '../../../core/data/base/create-data';
import {
  DeleteData,
  DeleteDataImpl,
} from '../../../core/data/base/delete-data';
import {
  FindAllData,
  FindAllDataImpl,
} from '../../../core/data/base/find-all-data';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import {
  PatchData,
  PatchDataImpl,
} from '../../../core/data/base/patch-data';
import { SearchDataImpl } from '../../../core/data/base/search-data';
import { ChangeAnalyzer } from '../../../core/data/change-analyzer';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { MultipartPostRequest } from '../../../core/data/request.models';
import { RequestService } from '../../../core/data/request.service';
import { RestRequest } from '../../../core/data/rest-request.model';
import { RestRequestMethod } from '../../../core/data/rest-request-method';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { NoContent } from '../../../core/shared/NoContent.model';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { LdnServiceConstrain } from '../ldn-services-model/ldn-service.constrain.model';
import { LdnService } from '../ldn-services-model/ldn-services.model';

/**
 * Injectable service responsible for fetching/sending data from/to the REST API on the ldnservices endpoint.
 *
 * @export
 * @class LdnServicesService
 * @extends {IdentifiableDataService<LdnService>}
 * @implements {FindAllData<LdnService>}
 * @implements {DeleteData<LdnService>}
 * @implements {PatchData<LdnService>}
 * @implements {CreateData<LdnService>}
 */
@Injectable({ providedIn: 'root' })
export class LdnServicesService extends IdentifiableDataService<LdnService> implements FindAllData<LdnService>, DeleteData<LdnService>, PatchData<LdnService>, CreateData<LdnService> {
  createData: CreateDataImpl<LdnService>;
  private findAllData: FindAllDataImpl<LdnService>;
  private deleteData: DeleteDataImpl<LdnService>;
  private patchData: PatchDataImpl<LdnService>;
  private comparator: ChangeAnalyzer<LdnService>;
  private searchData: SearchDataImpl<LdnService>;

  private findByPatternEndpoint = 'byInboundPattern';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('ldnservices', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.patchData = new PatchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.comparator, this.responseMsToLive, this.constructIdEndpoint);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
  }

  /**
   * Creates an LDN service by sending a POST request to the REST API.
   *
   * @param {LdnService} object - The LDN service object to be created.
   * @param params Array with additional params to combine with query string
   * @returns {Observable<RemoteData<LdnService>>} - Observable containing the result of the creation operation.
   */
  create(object: LdnService, ...params: RequestParam[]): Observable<RemoteData<LdnService>> {
    return this.createData.create(object, ...params);
  }

  /**
   * Updates an LDN service by applying a set of operations through a PATCH request to the REST API.
   *
   * @param {LdnService} object - The LDN service object to be updated.
   * @param {Operation[]} operations - The patch operations to be applied.
   * @returns {Observable<RemoteData<LdnService>>} - Observable containing the result of the update operation.
   */
  patch(object: LdnService, operations: Operation[]): Observable<RemoteData<LdnService>> {
    return this.patchData.patch(object, operations);
  }

  /**
   * Updates an LDN service by sending a PUT request to the REST API.
   *
   * @param {LdnService} object - The LDN service object to be updated.
   * @returns {Observable<RemoteData<LdnService>>} - Observable containing the result of the update operation.
   */
  update(object: LdnService): Observable<RemoteData<LdnService>> {
    return this.patchData.update(object);
  }

  /**
   * Commits pending updates by sending a PATCH request to the REST API.
   *
   * @param {RestRequestMethod} [method] - The HTTP method to be used for the request.
   */
  commitUpdates(method?: RestRequestMethod): void {
    return this.patchData.commitUpdates(method);
  }

  /**
   * Creates a patch representing the changes made to the LDN service in the cache.
   *
   * @param {LdnService} object - The LDN service object for which to create the patch.
   * @returns {Observable<Operation[]>} - Observable containing the patch operations.
   */
  createPatchFromCache(object: LdnService): Observable<Operation[]> {
    return this.patchData.createPatchFromCache(object);
  }

  /**
   * Retrieves all LDN services from the REST API based on the provided options.
   *
   * @param {FindListOptions} [options] - The options to be applied to the request.
   * @param {boolean} [useCachedVersionIfAvailable] - Flag indicating whether to use cached data if available.
   * @param {boolean} [reRequestOnStale] - Flag indicating whether to re-request data if it's stale.
   * @param {...FollowLinkConfig<LdnService>[]} linksToFollow - Optional links to follow during the request.
   * @returns {Observable<RemoteData<PaginatedList<LdnService>>>} - Observable containing the result of the request.
   */
  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<LdnService>[]): Observable<RemoteData<PaginatedList<LdnService>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Retrieves LDN services based on the inbound pattern from the REST API.
   *
   * @param {string} pattern - The inbound pattern to be used in the search.
   * @param {FindListOptions} [options] - The options to be applied to the request.
   * @param {boolean} [useCachedVersionIfAvailable] - Flag indicating whether to use cached data if available.
   * @param {boolean} [reRequestOnStale] - Flag indicating whether to re-request data if it's stale.
   * @param {...FollowLinkConfig<LdnService>[]} linksToFollow - Optional links to follow during the request.
   * @returns {Observable<RemoteData<PaginatedList<LdnService>>>} - Observable containing the result of the request.
   */
  findByInboundPattern(pattern: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<LdnService>[]): Observable<RemoteData<PaginatedList<LdnService>>> {
    const params = [new RequestParam('pattern', pattern)];
    const findListOptions = Object.assign(new FindListOptions(), options, { searchParams: params });
    return this.searchBy(this.findByPatternEndpoint, findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Deletes an LDN service by sending a DELETE request to the REST API.
   *
   * @param {string} objectId - The ID of the LDN service to be deleted.
   * @param {string[]} [copyVirtualMetadata] - Optional virtual metadata to be copied during the deletion.
   * @returns {Observable<RemoteData<NoContent>>} - Observable containing the result of the deletion operation.
   */
  public delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  /**
   * Deletes an LDN service by its HATEOAS link.
   *
   * @param {string} href - The HATEOAS link of the LDN service to be deleted.
   * @param {string[]} [copyVirtualMetadata] - Optional virtual metadata to be copied during the deletion.
   * @returns {Observable<RemoteData<NoContent>>} - Observable containing the result of the deletion operation.
   */
  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }


  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod                The search method for the object
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<LdnService>[]): Observable<RemoteData<PaginatedList<LdnService>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  public invoke(serviceName: string, serviceId: string, parameters: LdnServiceConstrain[], files: File[]): Observable<RemoteData<LdnService>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint().pipe(
      take(1),
      map((endpoint: string) => new URLCombiner(endpoint, serviceName, 'processes', serviceId).toString()),
      map((endpoint: string) => {
        const body = this.getInvocationFormData(parameters, files);
        return new MultipartPostRequest(requestId, endpoint, body);
      }),
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<LdnService>(requestId);
  }

  private getInvocationFormData(constrain: LdnServiceConstrain[], files: File[]): FormData {
    const form: FormData = new FormData();
    form.set('properties', JSON.stringify(constrain));
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }
}

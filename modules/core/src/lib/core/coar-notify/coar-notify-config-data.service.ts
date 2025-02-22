import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { SubmissionCoarNotifyConfig } from './submission-coar-notify.config';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { CreateData, CreateDataImpl } from '../data/base/create-data';
import { FindAllData, FindAllDataImpl } from '../data/base/find-all-data';
import { DeleteData, DeleteDataImpl } from '../data/base/delete-data';
import { PatchData, PatchDataImpl } from '../data/base/patch-data';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestParam } from '../cache/models/request-param.model';
import { RemoteData } from '../data/remote-data';
import { RestRequestMethod } from '../data/rest-request-method';
import { FindListOptions } from '../data/find-list-options.model';
import { FollowLinkConfig } from '../data/follow-link-config.model';
import { NoContent } from '../shared/NoContent.model';
import { URLCombiner } from '../url-combiner/url-combiner';
import { MultipartPostRequest } from '../data/request.models';
import { RestRequest } from '../data/rest-request.model';
import { PaginatedList } from '../data/paginated-list.model';


/**
 * A service responsible for fetching/sending data from/to the REST API on the CoarNotifyConfig endpoint
 */
@Injectable({ providedIn: 'root' })
export class CoarNotifyConfigDataService extends IdentifiableDataService<SubmissionCoarNotifyConfig> implements FindAllData<SubmissionCoarNotifyConfig>, DeleteData<SubmissionCoarNotifyConfig>, PatchData<SubmissionCoarNotifyConfig>, CreateData<SubmissionCoarNotifyConfig> {
  createData: CreateDataImpl<SubmissionCoarNotifyConfig>;
  private findAllData: FindAllDataImpl<SubmissionCoarNotifyConfig>;
  private deleteData: DeleteDataImpl<SubmissionCoarNotifyConfig>;
  private patchData: PatchDataImpl<SubmissionCoarNotifyConfig>;
  private comparator: ChangeAnalyzer<SubmissionCoarNotifyConfig>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('submissioncoarnotifyconfigs', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.patchData = new PatchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.comparator, this.responseMsToLive, this.constructIdEndpoint);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
  }


  create(object: SubmissionCoarNotifyConfig, ...params: RequestParam[]): Observable<RemoteData<SubmissionCoarNotifyConfig>> {
    return this.createData.create(object, ...params);
  }

  patch(object: SubmissionCoarNotifyConfig, operations: Operation[]): Observable<RemoteData<SubmissionCoarNotifyConfig>> {
    return this.patchData.patch(object, operations);
  }

  update(object: SubmissionCoarNotifyConfig): Observable<RemoteData<SubmissionCoarNotifyConfig>> {
    return this.patchData.update(object);
  }

  commitUpdates(method?: RestRequestMethod): void {
    return this.patchData.commitUpdates(method);
  }

  createPatchFromCache(object: SubmissionCoarNotifyConfig): Observable<Operation[]> {
    return this.patchData.createPatchFromCache(object);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<SubmissionCoarNotifyConfig>[]): Observable<RemoteData<PaginatedList<SubmissionCoarNotifyConfig>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }


  public delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  public invoke(serviceName: string, serviceId: string, files: File[]): Observable<RemoteData<SubmissionCoarNotifyConfig>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint().pipe(
      take(1),
      map((endpoint: string) => new URLCombiner(endpoint, serviceName, 'submissioncoarnotifyconfigmodel', serviceId).toString()),
      map((endpoint: string) => {
        const body = this.getInvocationFormData(files);
        return new MultipartPostRequest(requestId, endpoint, body);
      }),
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<SubmissionCoarNotifyConfig>(requestId);
  }

  private getInvocationFormData(files: File[]): FormData {
    const form: FormData = new FormData();
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }
}

import { Injectable } from '@angular/core';
import { RestRequestMethod } from '@dspace/config/rest-request-method';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { SubmissionCoarNotifyModel } from '../coar-notify/notify-info/models/submission-coar-notify.model';
import {
  CreateData,
  CreateDataImpl,
} from '../data/base/create-data';
import {
  DeleteData,
  DeleteDataImpl,
} from '../data/base/delete-data';
import {
  FindAllData,
  FindAllDataImpl,
} from '../data/base/find-all-data';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import {
  PatchData,
  PatchDataImpl,
} from '../data/base/patch-data';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { MultipartPostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { RestRequest } from '../data/rest-request.model';
import { NotificationsService } from '../notification-system/notifications.service';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NoContent } from '../shared/NoContent.model';
import { URLCombiner } from '../url-combiner/url-combiner';


/**
 * A service responsible for fetching/sending data from/to the REST API on the CoarNotifyConfig endpoint
 */
@Injectable({ providedIn: 'root' })
export class CoarNotifyConfigDataService extends IdentifiableDataService<SubmissionCoarNotifyModel> implements FindAllData<SubmissionCoarNotifyModel>, DeleteData<SubmissionCoarNotifyModel>, PatchData<SubmissionCoarNotifyModel>, CreateData<SubmissionCoarNotifyModel> {
  createData: CreateDataImpl<SubmissionCoarNotifyModel>;
  private findAllData: FindAllDataImpl<SubmissionCoarNotifyModel>;
  private deleteData: DeleteDataImpl<SubmissionCoarNotifyModel>;
  private patchData: PatchDataImpl<SubmissionCoarNotifyModel>;
  private comparator: ChangeAnalyzer<SubmissionCoarNotifyModel>;

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

  create(object: SubmissionCoarNotifyModel, ...params: RequestParam[]): Observable<RemoteData<SubmissionCoarNotifyModel>> {
    return this.createData.create(object, ...params);
  }

  patch(object: SubmissionCoarNotifyModel, operations: Operation[]): Observable<RemoteData<SubmissionCoarNotifyModel>> {
    return this.patchData.patch(object, operations);
  }

  update(object: SubmissionCoarNotifyModel): Observable<RemoteData<SubmissionCoarNotifyModel>> {
    return this.patchData.update(object);
  }

  commitUpdates(method?: RestRequestMethod): void {
    return this.patchData.commitUpdates(method);
  }

  createPatchFromCache(object: SubmissionCoarNotifyModel): Observable<Operation[]> {
    return this.patchData.createPatchFromCache(object);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<SubmissionCoarNotifyModel>[]): Observable<RemoteData<PaginatedList<SubmissionCoarNotifyModel>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  public delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  public invoke(serviceName: string, serviceId: string, files: File[]): Observable<RemoteData<SubmissionCoarNotifyModel>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint().pipe(
      take(1),
      map((endpoint: string) => new URLCombiner(endpoint, serviceName, 'submissioncoarnotifyconfigmodel', serviceId).toString()),
      map((endpoint: string) => {
        const body = this.getInvocationFormData(files);
        return new MultipartPostRequest(requestId, endpoint, body);
      }),
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<SubmissionCoarNotifyModel>(requestId);
  }

  private getInvocationFormData(files: File[]): FormData {
    const form: FormData = new FormData();
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }
}

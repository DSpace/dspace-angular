import { Injectable } from '@angular/core';
import { dataService } from '../../../core/data/base/data-service.decorator';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import { FindAllData, FindAllDataImpl } from '../../../core/data/base/find-all-data';
import { DeleteData, DeleteDataImpl } from '../../../core/data/base/delete-data';
import { RequestService } from '../../../core/data/request.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import { map, take } from 'rxjs/operators';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { MultipartPostRequest } from '../../../core/data/request.models';
import { RestRequest } from '../../../core/data/rest-request.model';
import { SUBMISSION_COAR_NOTIFY_CONFIG } from './section-coar-notify-service.resource-type';
import { SubmissionCoarNotifyConfig } from './submission-coar-notify.config';
import { CreateData, CreateDataImpl } from '../../../core/data/base/create-data';
import { PatchData, PatchDataImpl } from '../../../core/data/base/patch-data';
import { ChangeAnalyzer } from '../../../core/data/change-analyzer';
import { Operation } from 'fast-json-patch';
import { RestRequestMethod } from '../../../core/data/rest-request-method';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { hasValue } from '../../../shared/empty.util';


/**
 * A service responsible for fetching/sending data from/to the REST API on the CoarNotifyConfig endpoint
 */
@Injectable()
@dataService(SUBMISSION_COAR_NOTIFY_CONFIG)
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


  create(object: SubmissionCoarNotifyConfig): Observable<RemoteData<SubmissionCoarNotifyConfig>> {
    return this.createData.create(object);
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
      })
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<SubmissionCoarNotifyConfig>(requestId);
  }

  public SubmissionCoarNotifyConfigModelWithNameExistsAndCanExecute(scriptName: string): Observable<boolean> {
    return this.findById(scriptName).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<SubmissionCoarNotifyConfig>) => {
        return hasValue(rd.payload);
      }),
    );
  }

  private getInvocationFormData(files: File[]): FormData {
    const form: FormData = new FormData();
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }
}

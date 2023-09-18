 import { Injectable } from '@angular/core';
import { dataService } from '../../../core/data/base/data-service.decorator';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
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
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { hasValue } from '../../../shared/empty.util';

import { LdnService } from '../ldn-services-model/ldn-services.model';
import { LdnServiceConstraint } from '../ldn-services-model/ldn-service-constraint.model';

@Injectable()
@dataService(LDN_SERVICE)
export class LdnServicesService extends IdentifiableDataService<LdnService> implements FindAllData<LdnService>, DeleteData<LdnService> {
  private findAllData: FindAllDataImpl<LdnService>; // Corrected the type
  private deleteData: DeleteDataImpl<LdnService>; // Corrected the type

  constructor(
      protected requestService: RequestService,
      protected rdbService: RemoteDataBuildService,
      protected objectCache: ObjectCacheService,
      protected halService: HALEndpointService,
      protected notificationsService: NotificationsService,
  ) {
    super('ldnservices', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<LdnService>[]): Observable<RemoteData<PaginatedList<LdnService>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  public delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  public invoke(serviceName: string, parameters: LdnServiceConstraint[], files: File[]): Observable<RemoteData<LdnService>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint().pipe(
        take(1),
        map((endpoint: string) => new URLCombiner(endpoint, serviceName, 'processes').toString()),
        map((endpoint: string) => {
          const body = this.getInvocationFormData(parameters, files);
          return new MultipartPostRequest(requestId, endpoint, body);
        })
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<LdnService>(requestId);
  }

  private getInvocationFormData(constrain: LdnServiceConstraint[], files: File[]): FormData {
    const form: FormData = new FormData();
    form.set('properties', JSON.stringify(constrain));
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }

  public ldnServiceWithNameExistsAndCanExecute(scriptName: string): Observable<boolean> {
    return this.findById(scriptName).pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<LdnService>) => {
          return hasValue(rd.payload);
        }),
    );
  }
}

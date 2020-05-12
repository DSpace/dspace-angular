import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { METADATA_FIELD } from '../metadata/metadata-field.resource-type';
import { MetadataField } from '../metadata/metadata-field.model';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { CreateMetadataFieldRequest, FindListOptions, UpdateMetadataFieldRequest } from './request.models';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { SearchParam } from '../cache/models/search-param.model';
import { Observable } from 'rxjs/internal/Observable';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { MetadatafieldSuccessResponse, RestResponse } from '../cache/response.models';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the metadatafields endpoint
 */
@Injectable()
@dataService(METADATA_FIELD)
export class MetadataFieldDataService extends DataService<MetadataField> {
  protected linkPath = 'metadatafields';
  protected searchBySchemaLinkPath = 'bySchema';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<MetadataField>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService) {
    super();
  }

  findBySchema(schema: MetadataSchema, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<MetadataField>>) {
    const optionsWithSchema = Object.assign(new FindListOptions(), options, {
      searchParams: [new SearchParam('schema', schema.prefix)]
    });
    return this.searchBy(this.searchBySchemaLinkPath, optionsWithSchema, ...linksToFollow);
  }

  createOrUpdateMetadataField(field: MetadataField): Observable<RestResponse> {
    const isUpdate = hasValue(field.id);
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.getBrowseEndpoint().pipe(
      isNotEmptyOperator(),
      map((endpoint: string) => (isUpdate ? `${endpoint}/${field.id}` : `${endpoint}?schemaId=${field.schema.id}`)),
      distinctUntilChanged()
    );

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => {
        if (isUpdate) {
          const options: HttpOptions = Object.create({});
          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          options.headers = headers;
          return new UpdateMetadataFieldRequest(requestId, endpoint, JSON.stringify(field), options);
        } else {
          return new CreateMetadataFieldRequest(requestId, endpoint, JSON.stringify(field));
        }
      })
    );

    // Execute the post/put request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Return response
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful) {
          if (hasValue((response as any).errorMessage)) {
            this.notificationsService.error('Server Error:', (response as any).errorMessage, new NotificationOptions(-1));
          }
        } else {
          return response;
        }
      }),
      isNotEmptyOperator()
    );
  }

  clearRequests(): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      tap((href: string) => this.requestService.removeByHrefSubstring(href))
    );
  }

}

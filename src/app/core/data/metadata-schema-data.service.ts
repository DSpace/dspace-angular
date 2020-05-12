import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService, getClassForType } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { METADATA_SCHEMA } from '../metadata/metadata-schema.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RequestService } from './request.service';
import { Observable } from 'rxjs/internal/Observable';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { CreateMetadataSchemaRequest, UpdateMetadataSchemaRequest } from './request.models';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { MetadataschemaSuccessResponse, RestResponse } from '../cache/response.models';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the metadataschemas endpoint
 */
@Injectable()
@dataService(METADATA_SCHEMA)
export class MetadataSchemaDataService extends DataService<MetadataSchema> {
  protected linkPath = 'metadataschemas';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<MetadataSchema>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService) {
    super();
  }

  createOrUpdateMetadataSchema(schema: MetadataSchema): Observable<RestResponse> {
    const isUpdate = hasValue(schema.id);
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.getBrowseEndpoint().pipe(
      isNotEmptyOperator(),
      map((endpoint: string) => (isUpdate ? `${endpoint}/${schema.id}` : endpoint)),
      distinctUntilChanged()
    );

    const serializedSchema = new DSpaceSerializer(getClassForType(MetadataSchema.type)).serialize(schema);

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => {
        if (isUpdate) {
          const options: HttpOptions = Object.create({});
          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          options.headers = headers;
          return new UpdateMetadataSchemaRequest(requestId, endpoint, JSON.stringify(serializedSchema), options);
        } else {
          return new CreateMetadataSchemaRequest(requestId, endpoint, JSON.stringify(serializedSchema));
        }
      })
    );

    // Execute the post/put request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Return created/updated schema
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

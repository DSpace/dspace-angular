import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { METADATA_SCHEMA } from '../metadata/metadata-schema.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';
import { hasValue } from '../../shared/empty.util';
import { tap } from 'rxjs/operators';
import { RemoteData } from './remote-data';
import { CoreState } from '../core-state.model';

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

  /**
   * Create or Update a MetadataSchema
   *  If the MetadataSchema contains an id, it is assumed the schema already exists and is updated instead
   *  Since creating or updating is nearly identical, the only real difference is the request (and slight difference in endpoint):
   *  - On creation, a CreateRequest is used
   *  - On update, a PutRequest is used
   * @param schema    The MetadataSchema to create or update
   */
  createOrUpdateMetadataSchema(schema: MetadataSchema): Observable<RemoteData<MetadataSchema>> {
    const isUpdate = hasValue(schema.id);

    if (isUpdate) {
      return this.put(schema);
    } else {
      return this.create(schema);
    }
  }

  /**
   * Clear all metadata schema requests
   * Used for refreshing lists after adding/updating/removing a metadata schema in the registry
   */
  clearRequests(): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      tap((href: string) => this.requestService.removeByHrefSubstring(href))
    );
  }

}

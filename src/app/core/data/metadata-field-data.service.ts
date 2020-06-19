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
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { METADATA_FIELD } from '../metadata/metadata-field.resource-type';
import { MetadataField } from '../metadata/metadata-field.model';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { FindListOptions, FindListRequest } from './request.models';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs/internal/Observable';
import { hasValue } from '../../shared/empty.util';
import { find, skipWhile, switchMap, tap } from 'rxjs/operators';
import { RemoteData } from './remote-data';
import { RequestParam } from '../cache/models/request-param.model';
import { PaginatedList } from './paginated-list';

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

  /**
   * Find metadata fields belonging to a metadata schema
   * @param schema        The metadata schema to list fields for
   * @param options       The options info used to retrieve the fields
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findBySchema(schema: MetadataSchema, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<MetadataField>>) {
    const optionsWithSchema = Object.assign(new FindListOptions(), options, {
      searchParams: [new RequestParam('schema', schema.prefix)]
    });
    return this.searchBy(this.searchBySchemaLinkPath, optionsWithSchema, ...linksToFollow);
  }

  /**
   * Create or Update a MetadataField
   *  If the MetadataField contains an id, it is assumed the field already exists and is updated instead
   *  Since creating or updating is nearly identical, the only real difference is the request (and slight difference in endpoint):
   *  - On creation, a CreateRequest is used
   *  - On update, a PutRequest is used
   * @param field    The MetadataField to create or update
   */
  createOrUpdateMetadataField(field: MetadataField): Observable<RemoteData<MetadataField>> {
    const isUpdate = hasValue(field.id);

    if (isUpdate) {
      return this.put(field);
    } else {
      return this.create(field, new RequestParam('schemaId', field.schema.id));
    }
  }

  /**
   * Clear all metadata field requests
   * Used for refreshing lists after adding/updating/removing a metadata field from a metadata schema
   */
  clearRequests(): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      tap((href: string) => {
        this.requestService.removeByHrefSubstring(href);
      })
    );
  }

}

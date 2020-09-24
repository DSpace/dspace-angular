import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';
import { dataService } from '../cache/builders/build-decorators';
import { DataService } from './data.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
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
import { FindListOptions } from './request.models';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { RequestParam } from '../cache/models/request-param.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the metadatafields endpoint
 */
@Injectable()
@dataService(METADATA_FIELD)
export class MetadataFieldDataService extends DataService<MetadataField> {
  protected linkPath = 'metadatafields';
  protected searchBySchemaLinkPath = 'bySchema';
  protected searchByFieldNameLinkPath = 'byFieldName';

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
   * Find metadata fields with either the partial metadata field name (e.g. "dc.ti") as query or an exact match to
   * at least the schema, element or qualifier
   * @param schema    optional; an exact match of the prefix of the metadata schema (e.g. "dc", "dcterms", "eperson")
   * @param element   optional; an exact match of the field's element (e.g. "contributor", "title")
   * @param qualifier optional; an exact match of the field's qualifier (e.g. "author", "alternative")
   * @param query     optional (if any of schema, element or qualifier used) - part of the fully qualified field,
   * should start with the start of the schema, element or qualifier (e.g. “dc.ti”, “contributor”, “auth”, “contributor.ot”)
   * @param exactName optional; the exact fully qualified field, should use the syntax schema.element.qualifier or
   * schema.element if no qualifier exists (e.g. "dc.title", "dc.contributor.author"). It will only return one value
   * if there's an exact match
   * @param options   The options info used to retrieve the fields
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  searchByFieldNameParams(schema: string, element: string, qualifier: string, query: string, exactName: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<MetadataField>>): Observable<RemoteData<PaginatedList<MetadataField>>> {
    const optionParams = Object.assign(new FindListOptions(), options, {
      searchParams: [
        new RequestParam('schema', hasValue(schema) ? schema : ''),
        new RequestParam('element', hasValue(element) ? element : ''),
        new RequestParam('qualifier', hasValue(qualifier) ? qualifier : ''),
        new RequestParam('query', hasValue(query) ? query : ''),
        new RequestParam('exactName', hasValue(exactName) ? exactName : '')
      ]
    });
    return this.searchBy(this.searchByFieldNameLinkPath, optionParams, ...linksToFollow);
  }

  /**
   * Finds a specific metadata field by name.
   * @param exactFieldName  The exact fully qualified field, should use the syntax schema.element.qualifier or
   * schema.element if no qualifier exists (e.g. "dc.title", "dc.contributor.author"). It will only return one value
   * if there's an exact match, empty list if there is no exact match.
   */
  findByExactFieldName(exactFieldName: string): Observable<RemoteData<PaginatedList<MetadataField>>> {
    return this.searchByFieldNameParams(null, null, null, null, exactFieldName, null);
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

import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RequestParam } from '../cache/models/request-param.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { METADATA_BITSTREAM } from '../metadata/metadata-bitstream.resource-type';
import { MetadataBitstream } from '../metadata/metadata-bitstream.model';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { ChangeAnalyzer } from './change-analyzer';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { SearchData, SearchDataImpl } from './base/search-data';
import { CoreState } from '../core-state.model';
import { dataService } from './base/data-service.decorator';
import { FindListOptions } from './find-list-options.model';
import { linkName } from './clarin/clarin-license-data.service';
import { PaginatedList } from './paginated-list.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the metadatafields endpoint
 */
@Injectable()
@dataService(METADATA_BITSTREAM)
export class MetadataBitstreamDataService extends IdentifiableDataService<MetadataBitstream> implements SearchData<MetadataBitstream> {
  protected store: Store<CoreState>;
  protected http: HttpClient;
  protected comparator: ChangeAnalyzer<MetadataBitstream>;
  protected linkPath = 'metadatabitstreams';
  protected searchByHandleLinkPath = 'byHandle';
  private searchData: SearchData<MetadataBitstream>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Find metadata fields with either the partial metadata field name (e.g. "dc.ti") as query or an exact match to
   * at least the schema, element or qualifier
   * @param handle    optional; an exact match of the prefix of the item identifier (e.g. "123456789/1126")
   * @param fileGrpType   optional; an exact match of the type of the file(e.g. "TEXT", "THUMBNAIL")
   * @param options   The options info used to retrieve the fields
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's no valid cached version. Defaults to true
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after the response becomes stale
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  searchByHandleParams(handle: string, fileGrpType: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]): Observable<RemoteData<any>> {
    const optionParams = Object.assign(new FindListOptions(), options, {
      searchParams: [
        new RequestParam('handle', hasValue(handle) ? handle : ''),
        new RequestParam(
          'fileGrpType',
          hasValue(fileGrpType) ? fileGrpType : ''
        ),
      ],
    });
    return this.searchBy(this.searchByHandleLinkPath, optionParams, useCachedVersionIfAvailable, reRequestOnStale,
      ...linksToFollow);
  }

  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<MetadataBitstream>[]): Observable<RemoteData<PaginatedList<MetadataBitstream>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}

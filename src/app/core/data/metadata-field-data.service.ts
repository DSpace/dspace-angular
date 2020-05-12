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
import { FindListOptions } from './request.models';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { SearchParam } from '../cache/models/search-param.model';

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

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { METADATA_SCHEMA } from '../metadata/metadata-schema.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RequestService } from './request.service';

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
}

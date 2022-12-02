import { ResourceType } from '../../shared/resource-type';
import { Injectable } from '@angular/core';
import { dataService } from '../../cache/builders/build-decorators';
import { DataService } from '../data.service';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ClarinLicenseResourceMapping } from '../../shared/clarin/clarin-license-resource-mapping.model';

export const linkName = 'clarinlicenseresourcemappings';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending clarin license resource mapping from/to the Clarin License
 * Resource Mapping REST API
 */
@Injectable()
@dataService(ClarinLicenseResourceMapping.type)
export class ClarinLicenseResourceMappingService extends DataService<ClarinLicenseResourceMapping> {
  protected linkPath = linkName;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClarinLicenseResourceMapping>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super();
  }
}

import { Injectable } from '@angular/core';
import { dataService } from './data/base/data-service.decorator';
import { BaseDataService } from './data/base/base-data.service';
import { RequestService } from './data/request.service';
import { RemoteDataBuildService } from './cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from './core-state.model';
import { HALEndpointService } from './shared/hal-endpoint.service';
import { ObjectCacheService } from './cache/object-cache.service';
import { DefaultChangeAnalyzer } from './data/default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { linkName } from './data/clarin/clrua-data.service';
import { BitstreamChecksum } from './shared/bitstream-checksum.model';

/**
 * A service responsible for fetching BitstreamChecksum objects from the REST API
 */
@Injectable()
@dataService(BitstreamChecksum.type)
export class BitstreamChecksumDataService extends BaseDataService<BitstreamChecksum> {
  protected linkPath = 'checksum';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<BitstreamChecksum>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);
  }
}

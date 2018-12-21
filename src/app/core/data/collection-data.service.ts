import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Collection } from '../shared/collection.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DataBuildService } from '../cache/builders/data-build.service';
import { DSOUpdateComparator } from './dso-update-comparator';

@Injectable()
export class CollectionDataService extends ComColDataService<NormalizedCollection, Collection> {
  protected linkPath = 'collections';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: DataBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOUpdateComparator
  ) {
    super();
  }

}

import { ResourceType } from '../../shared/resource-type';
import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ClruaModel } from '../../shared/clarin/clrua.model';
import { dataService } from '../base/data-service.decorator';
import { BaseDataService } from '../base/base-data.service';
import { CoreState } from '../../core-state.model';

export const linkName = 'clarinlruallowances';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending CLRUA data from/to the Clarin License Resource User Allowance REST API
 */
@Injectable()
@dataService(ClruaModel.type)
export class ClruaDataService extends BaseDataService<ClruaModel> {
  protected linkPath = linkName;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClruaModel>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);
  }
}

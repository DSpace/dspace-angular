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
import { ClarinUserRegistration } from '../../shared/clarin/clarin-user-registration.model';

export const linkName = 'clarinuserregistrations';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending user registration data from/to the Clarin User Registration REST API
 */
@Injectable()
@dataService(ClarinUserRegistration.type)
export class ClarinUserRegistrationDataService extends DataService<ClarinUserRegistration> {
  protected linkPath = linkName;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClarinUserRegistration>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super();
  }
}

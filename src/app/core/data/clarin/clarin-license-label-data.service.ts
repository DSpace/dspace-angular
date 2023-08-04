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
import { ClarinLicenseLabel } from '../../shared/clarin/clarin-license-label.model';
import { BaseDataService } from '../base/base-data.service';
import { dataService } from '../base/data-service.decorator';
import {CreateData, CreateDataImpl} from '../base/create-data';
import {RequestParam} from '../../cache/models/request-param.model';
import {Observable} from 'rxjs';
import {RemoteData} from '../remote-data';
import {CoreState} from '../../core-state.model';
import {FindAllData, FindAllDataImpl} from '../base/find-all-data';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { FindListOptions } from '../find-list-options.model';
import { PaginatedList } from '../paginated-list.model';

export const linkName = 'clarinlicenselabels';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending data from/to the REST API - vocabularies endpoint
 */
@Injectable()
@dataService(ClarinLicenseLabel.type)
export class ClarinLicenseLabelDataService extends BaseDataService<ClarinLicenseLabel> implements CreateData<ClarinLicenseLabel>, FindAllData<ClarinLicenseLabel> {
  protected linkPath = linkName;
  private createData: CreateData<ClarinLicenseLabel>;
  private findAllData: FindAllData<ClarinLicenseLabel>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClarinLicenseLabel>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<ClarinLicenseLabel>[]): Observable<RemoteData<PaginatedList<ClarinLicenseLabel>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  create(object: ClarinLicenseLabel, ...params: RequestParam[]): Observable<RemoteData<ClarinLicenseLabel>> {
    return this.createData.create(object, ...params);
  }
}
